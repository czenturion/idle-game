import { create } from 'zustand';

export const BOSSES = [
    { name: 'Комарик', hp: 5, def: 5, str: 5 },
    { name: 'Ветер', hp: 8, def: 8, str: 8 },
]

const initialStats = {
    hp: 1, def: 1, str: 1
}

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
    },

    resetBattle: () => {
        clearInterval(get().battleIntervalId)
        const { bossIndex, stats } = get()
        const bossData = BOSSES[bossIndex]
        set({
            battleState: 'idle',
            boss: { ...bossData, bossCurHp: bossData.hp },
        })
    }
}))

export default useGameStore;