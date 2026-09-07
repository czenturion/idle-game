export const initialStats = {
    hp: 1, def: 1, str: 1
}

export const BOSSES = [
    { name: 'Комарик', hp: 5, def: 5, str: 5 },
    { name: 'Ветер', hp: 8, def: 8, str: 8 },
];

export const INITIAL_QUESTS = [
  {
    id: 'q1',
    name: 'Первая энергия',
    description: 'Накопи 10 энергии',
    type: 'energy',
    target: 10,
    current: 0,
    completed: false,
    claimed: false,
    rewardType: 'souls',
    rewardAmount: 1,
  },
  {
    id: 'q2',
    name: 'Первый босс',
    description: 'Убей босса Комарик',
    type: 'boss_kills',
    target: 1,
    current: 0,
    completed: false,
    claimed: false,
    rewardType: 'energy',
    rewardAmount: 5,
  },
  {
    id: 'q3',
    name: 'Силач',
    description: 'Прокачай силу до 10',
    type: 'stat_level',
    stat: 'str',
    target: 10,
    current: 0,
    completed: false,
    claimed: false,
    rewardType: 'energy',
    rewardAmount: 10,
  },
];