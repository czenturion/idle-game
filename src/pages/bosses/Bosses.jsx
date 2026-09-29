import useGameStore from '../../store/gameStore';
import s from './Bosses.module.css';
import { PixelButton, PixelCard, PixelProgress, PixelSectionHeader, PixelAvatar } from '@pxlkit/ui-kit';

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
    <div className={s.bossContainer}>
      <PixelSectionHeader tone='green' title='Боссы' description='Сторимод' />

      <PixelCard>
        <div className={s.cardBody}>
          <div className={s.bossHeader}>
            <PixelAvatar name="Boss avatar" src={boss.sprite} alt={boss.name} tone="red" size="lg" />
            {boss.name}
          </div>
          <div className={s.bars}>
            <PixelProgress value={bossHpPercent} max={100} tone='red' />
            <p>⚔️ Атака: {boss.str} | 🛡️ Защита: {boss.def}</p>
          </div>
        </div>
      </PixelCard>

      <PixelCard title='Игрок'>

        <PixelProgress value={playerHpPercent} max={100} tone='green' />

        <p>⚔️ Атака: {stats.str} | 🛡️ Защита: {stats.def}</p>
      </PixelCard>

      <div className={s.actions}>
        {(battleState === 'idle' || battleState === 'lost') && (
          <PixelButton tone='cyan' size="lg" onClick={startBattle}>
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