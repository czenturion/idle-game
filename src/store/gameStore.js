import { create } from 'zustand';
import { initialStats, BOSSES, INITIAL_QUESTS, SOUL_UPGRADES } from './constants';


const useGameStore = create((set, get) => ({

    // Ресурсы
    energy: 10000,
    progress: 0,
    fillSpeed: 1,
    autoincome: 0,
    currentUpgradeCost: 1,
    souls: 0,

    // Статы игрока
    stats: initialStats,
    playerCurHp: initialStats.hp,

    // Боссы
    bossIndex: 0,
    boss: {
        ...BOSSES[0],
        bossCurHp: BOSSES[0].hp
    },
    battleState: 'idle',  // 'idle' | 'fighting' | 'won' | 'lost'
    bossKills: 0,
    totalBossKills: 0,

    quests: INITIAL_QUESTS,
    soulUpgrades: SOUL_UPGRADES,


    // Шкала энергии
    tickProgress: () => {
        const { energy, progress, fillSpeed } = get();
        const step = 1 * fillSpeed;
        const newProgress = progress + step;

        if (newProgress >= 100) {
            set({
                energy: energy + 1,
                progress: 0,
            });
            get().checkQuests();
        } else {
            set({ progress: newProgress });
        }

    },

    // Прокачка статов
    increaseStat: (statName, amount = 1) => {
        const { energy, currentUpgradeCost } = get()
        if (energy < currentUpgradeCost) return false

        set((state) => ({
            ...state,
            stats: {
                ...state.stats,
                [statName]: state.stats[statName] + 1,
            },
            energy: state.energy - state.currentUpgradeCost,
            currentUpgradeCost: state.currentUpgradeCost + 1,
        }))
        get().checkQuests();
        return true
    },

    buySoulUpgrade: (upgradeId) => {
        const { soulUpgrades, souls } = get()
        const index = soulUpgrades.findIndex((SU) => SU.id === upgradeId)
        if (index === -1) return false

        const upgrade = soulUpgrades[index]
        if (upgrade.level >= upgrade.maxLevel) return false

        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level))
        if (souls < cost) return false

        const newUpgrades = [...soulUpgrades]
        newUpgrades[index] = { ...upgrade, level: upgrade.level + 1 }
        set({
            soulUpgrades: newUpgrades,
            souls: souls - cost,
        })
        return true
    },

    getEffectiveStat: (statName) => {
        const { stats, soulUpgrades } = get()
        const base = stats[statName] || 0
        const upgrade = soulUpgrades.find((SU) => SU.stat === statName)
        if (upgrade && upgrade.level > 0) {
            const bonus = base * (upgrade.level * upgrade.bonusPercent / 100)
            return base + bonus
        }
        return base
    },

    // Смена босса
    setBoss: (index) => {
        const bossData = BOSSES[index]
        set({
            bossIndex: index,
            boss: {
                ...bossData,
                bossCurHp: bossData.hp,
            },
            battleState: 'idle',
        })
    },

    // Запуск боя
    startBattle: () => {
        const { battleState } = get()
        if (battleState === 'fighting') return
        if (battleState === 'all_defeated') return

        const { boss } = get()


        if (boss.bossCurHp <= 0) {
            set({
                boss: { ...boss, bossCurHp: boss.hp }
            })
        }
        set({ battleState: 'fighting' })
    },

    update: (deltaTime) => {
        const { stats, playerCurHp, boss, battleState } = get()
        if (!deltaTime || deltaTime <= 0) return

        const PLAYER_REGEN_PERCENT = 0.05;
        const BOSS_REGEN_PERCENT = 0.025;

        let newPlayerHp = playerCurHp
        if (newPlayerHp < stats.hp) {
            const regenAmount = stats.hp * PLAYER_REGEN_PERCENT * deltaTime
            newPlayerHp = Math.min(stats.hp, newPlayerHp + regenAmount)
        }

        let newBoss = { ...boss }
        if (newBoss.bossCurHp < newBoss.hp) {
            const regenAmount = newBoss.hp * BOSS_REGEN_PERCENT * deltaTime
            newBoss.bossCurHp = Math.min(newBoss.hp, newBoss.bossCurHp + regenAmount)
        }

        let newState = battleState

        if (battleState === 'fighting') {
            const effectiveStr = get().getEffectiveStat('str')
            const effectiveDef = get().getEffectiveStat('def')

            const playerDPS = Math.max(0, effectiveStr - newBoss.def)
            const bossDPS = Math.max(0, newBoss.str - effectiveDef)

            newBoss.bossCurHp = Math.max(0, newBoss.bossCurHp - playerDPS * deltaTime)
            newPlayerHp = Math.max(0, newPlayerHp - bossDPS * deltaTime)

            if (newBoss.bossCurHp <= 0) {
                const nextIndex = get().bossIndex + 1;
                const newBossKills = get().bossKills + 1;
                const newTotalBossKills = get().totalBossKills + 1;

                if (nextIndex < BOSSES.length) {
                    const nextBossData = BOSSES[nextIndex];
                    set({
                        bossIndex: nextIndex,
                        boss: { ...nextBossData, bossCurHp: nextBossData.hp },
                        battleState: 'idle',
                        bossKills: newBossKills,
                        totalBossKills: newTotalBossKills,
                    });
                } else {
                    set({
                        battleState: 'all_defeated',
                        boss: { ...newBoss, bossCurHp: 0 },
                        bossKills: newBossKills,
                        totalBossKills: newTotalBossKills,
                    });
                }
                get().checkQuests();
                return;
            }

            if (newPlayerHp <= 0) {
                set({
                    playerCurHp: 0,
                    boss: newBoss,
                    battleState: 'lost',
                });
                get().checkQuests();
                return;
            }
        }

        set({
            playerCurHp: newPlayerHp,
            boss: newBoss,
            battleState: newState,
        });
        get().checkQuests(); 
    },

    resetBattle: () => {
        const { bossIndex } = get()
        const bossData = BOSSES[bossIndex]
        set({
            battleState: 'idle',
            boss: { ...bossData, bossCurHp: bossData.hp },
        })
    },

    checkQuests: () => {
        const { quests, stats, energy, totalBossKills } = get();
        let changed = false;

        const newQuests = quests.map((quest) => {
            if (quest.completed || quest.claimed) return quest;

            let current = quest.current;
            switch (quest.type) {
                case 'energy':
                    current = energy;
                    break;
                case 'boss_kills':
                    current = totalBossKills;
                    break;
                case 'stat_level':
                    current = stats[quest.stat] || 0;
                    break;
                default:
                    break;
            }

            const completed = current >= quest.target;

            if (current !== quest.current || completed !== quest.completed) {
                changed = true;
                return { ...quest, current, completed };
            }
            return quest;
        })

        if (changed) {
            set({ quests: newQuests });
        }
    },

    claimQuestReward: (questId) => {
        const { quests, energy, souls } = get();
        const quest = quests.find((q) => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) return false;

        let newEnergy = energy;
        let newSouls = souls;
        if (quest.rewardType === 'energy') {
            newEnergy += quest.rewardAmount;
        } else if (quest.rewardType === 'souls') {
            newSouls += quest.rewardAmount;
        }

        const newQuests = quests.map((q) => q.id === questId ? { ...q, claimed: true } : q);

        set({ quests: newQuests, energy: newEnergy, souls: newSouls });
        return true;
    },

    rebirth: () => {
        const { bossKills, souls } = get()
        if (bossKills === 0) return false

        const newSouls = souls + bossKills
        const firstBoss = BOSSES[0]

        set({
            bossIndex: 0,
            boss: { ...firstBoss, bossCurHp: firstBoss.hp },
            battleState: 'idle',
            bossKills: 0,
            souls: newSouls
        })
        return true
    }
}))

export default useGameStore;