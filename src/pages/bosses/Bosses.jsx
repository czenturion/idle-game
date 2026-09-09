import { useEffect, useRef } from 'react';
import useGameStore from '../../store/gameStore';
import { BOSSES } from '../../store/constants';
import styles from './Bosses.module.css';

function Bosses() {
  const boss = useGameStore((state) => state.boss);
  const playerCurHp = useGameStore((state) => state.playerCurHp);
  const stats = useGameStore((state) => state.stats);
  const battleState = useGameStore((state) => state.battleState);
  const bossKills = useGameStore((state) => state.bossKills);
  const startBattle = useGameStore((state) => state.startBattle);
  const resetBattle = useGameStore((state) => state.resetBattle);
  const rebirth = useGameStore((state) => state.rebirth);
  const update = useGameStore((state) => state.update);


  const bossHpPercent = boss.hp > 0 ? (boss.bossCurHp / boss.hp) * 100 : 0;
  const playerHpPercent = stats.hp > 0 ? (playerCurHp / stats.hp) * 100 : 0;

  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrameId;

    const loop = (time) => {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const clampedDelta = Math.min(deltaTime, 0.5);

      update(deltaTime);
    
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [update]);

  const canRebirth = bossKills > 0 && battleState !== 'fighting'

  return (
    <div className={styles.bossContainer}>
      <h2 className={styles.bossHeading}>Боссы</h2>

      <div className={styles.bossCard}>
        <h3>{boss.name}</h3>
        <div className={styles.hpBar}>
          <div className={styles.hpFill} style={{ width: `${bossHpPercent}%` }} />
          <span>{Math.ceil(boss.bossCurHp * 100) / 100} / {boss.hp}</span>
        </div>
        <p>⚔️ Атака: {boss.str} | 🛡️ Защита: {boss.def}</p>
      </div>

      <div className={styles.playerCard}>
        <h3>🧑 Игрок</h3>
        <div className={styles.hpBar}>
          <div className={styles.hpFill} style={{ width: `${playerHpPercent}%` }} />
          <span>{Math.ceil(playerCurHp * 100) / 100} / {stats.hp}</span>
        </div>
        <p>⚔️ Атака: {stats.str} | 🛡️ Защита: {stats.def}</p>
      </div>

      <div className={styles.actions}>
        {(battleState === 'idle' || battleState === 'lost') && (
          <button onClick={startBattle} className={styles.btnFight}>
            ⚔️ Атаковать!
          </button>
        )}
        {battleState === 'fighting' && (
          <button disabled className={styles.btnFighting}>
            🔄 Бой идёт...
          </button>
        )}
        {(battleState === 'won' || battleState === 'lost') && (
          <button onClick={resetBattle} className={styles.btnReset}>
            🔁 Начать заново
          </button>
        )}
      </div>
    </div>
  );
}

export default Bosses;