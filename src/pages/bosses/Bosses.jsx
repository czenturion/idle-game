import { useEffect, useRef } from 'react';
import useGameStore from '../../store/gameStore';
import styles from './Bosses.module.css';
import { PixelButton, PixelCard, PixelProgress } from '@pxlkit/ui-kit';

function Bosses() {
  const boss = useGameStore((state) => state.boss);
  const playerCurHp = useGameStore((state) => state.playerCurHp);
  const stats = useGameStore((state) => state.stats);
  const battleState = useGameStore((state) => state.battleState);
  const bossKills = useGameStore((state) => state.bossKills);
  const startBattle = useGameStore((state) => state.startBattle);
  const resetBattle = useGameStore((state) => state.resetBattle);
  const rebirth = useGameStore((state) => state.rebirth);


  const bossHpPercent = boss.hp > 0 ? (boss.bossCurHp / boss.hp) * 100 : 0;
  const playerHpPercent = stats.hp > 0 ? (playerCurHp / stats.hp) * 100 : 0;

  const canRebirth = bossKills > 0 && battleState !== 'fighting'

  return (
    <div className={styles.bossContainer}>
      <h2 className={styles.bossHeading}>Боссы</h2>

      <PixelCard title={boss.name}>
        
        <PixelProgress value={bossHpPercent} max={stats.hp} tone='red'/>
        <p>⚔️ Атака: {boss.str} | 🛡️ Защита: {boss.def}</p>
      </PixelCard>

      <PixelCard title='Игрок'>
        
          <PixelProgress value={playerHpPercent} max={stats.hp} tone='green'/>
        
        <p>⚔️ Атака: {stats.str} | 🛡️ Защита: {stats.def}</p>
      </PixelCard>

      <div className={styles.actions}>
        {(battleState === 'idle' || battleState === 'lost') && (
          <PixelButton tone='cyan' size="lg" onClick={startBattle} className='--retro-green'>
            ⚔️ Атаковать!
          </PixelButton>
        )}
        {battleState === 'fighting' && (
          <PixelButton disabled size="lg" tone='green'>
            🔄 Бой идёт...
          </PixelButton>
        )}
        {(battleState === 'won' || battleState === 'lost') && (
          <PixelButton tone='red' size="lg" onClick={resetBattle}>
            🔁 Начать заново
          </PixelButton>
        )}
      </div>
    </div >
  );
}

export default Bosses;