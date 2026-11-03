# Idle Game

Browser idle RPG: collect energy, level up your hero and defeat weather bosses.

## Gameplay

- **Energy** fills up on its own. Spend it on hero stats: strength, defense and health. Every upgrade costs one more than the previous one.
- **Bosses**: four weather-themed bosses, each stronger than the last. Once started, a fight plays out in real time based on your stats.
- **Quests** give rewards for reaching goals: collect energy, defeat a boss, level a stat.
- **Rebirth** resets boss progress and turns defeated bosses into souls.
- **Soul market**: spend souls on permanent percentage bonuses to stats.

## Technical details

- Game state lives in a single Zustand store; components read only the slices they need
- The game loop runs on `requestAnimationFrame` with delta time, capped so the game does not jump after the tab was in the background
- "Buy max" upgrade cost is calculated with a formula (sum of an arithmetic progression) instead of a loop, see `src/shared/helpers/gameMath.js`
- Separate pages for researches, quests and bosses with React Router
- Pixel-art style: Press Start 2P font, custom sprites, CSS Modules

## Stack

React 19, Zustand, React Router, Vite, CSS Modules, ESLint, Prettier

## Run locally

```bash
npm install
npm run dev
```
