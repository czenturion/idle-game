import { create } from 'zustand';
import { initialStats, BOSSES, INITIAL_QUESTS } from './constants';

const useGameStore = create((set, get) => ({

    // Ресурсы
    energy: 0,
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

    quests: INITIAL_QUESTS,


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
        get().checkQuests();
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
        clearInterval(get().battleIntervalId)
        set({ battleIntervalId: null })
    },

    // Запуск боя
    startBattle: () => {
        const { boss, battleState } = get()
        if (battleState === 'fighting') return

        const newBoss = { ...boss, bossCurHp: boss.hp }

        set({
            boss: newBoss,
            battleState: 'fighting',
        })
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
            const playerDPS = Math.max(1, stats.str - newBoss.def)
            const bossDPS = Math.max(1, newBoss.str - stats.def)

            newBoss.bossCurHp -= playerDPS * deltaTime
            newPlayerHp -= bossDPS * deltaTime

            newBoss.bossCurHp = Math.max(0, newBoss.bossCurHp)
            newPlayerHp = Math.max(0, newPlayerHp)

            if (newBoss.bossCurHp <= 0) {
                newState = 'idle'
                set((state) => ({ souls: state.souls + 1 }))
            } else if (newPlayerHp <= 0) {
                newState = 'lost'
            }
        }

        set({
            playerCurHp: newPlayerHp,
            boss: newBoss,
            battleState: newState
        })
        if (newState === 'idle') get().checkQuests();
    },

    resetBattle: () => {
        clearInterval(get().battleIntervalId)
        const { bossIndex, stats } = get()
        const bossData = BOSSES[bossIndex]
        set({
            battleState: 'idle',
            boss: { ...bossData, bossCurHp: bossData.hp },
        })
    },

    checkQuests: () => {
        const { quests, stats, energy, souls, bossIndex } = get();
        let updated = false;

        const newQuests = quests.map((quest) => {
            if (quest.completed || quest.claimed) return quest;

            let current = quest.current;
            switch (quest.type) {
                case 'energy':
                    current = energy;
                    break;
                case 'boss_kills':
                    current = souls;
                    break;
                case 'stat_level':
                    current = stats[quest.stat] || 0;
                    break;
                default:
                    break;
            }

            const completed = current >= quest.target;
            if (completed && !quest.completed) {
                updated = true;
            }
            return { ...quest, current, completed };
        })

        if (updated) {
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
    }
}))

export default useGameStore;