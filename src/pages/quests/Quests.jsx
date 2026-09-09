import useGameStore from '../../store/gameStore';
import s from './Quests.module.css';

function Quests() {
  const quests = useGameStore((state) => state.quests);
  const claimQuestReward = useGameStore((state) => state.claimQuestReward);

  return (
    <div className={s.questContainer}>
      <h2 className={s.questsHeading}>Задания</h2>
      {quests.length === 0 ? (
        <p>Нет заданий</p>
      ) : (
        <ul className={s.questList}>
          {quests.map((quest) => (
            <li key={quest.id} className={`${s.questItem} ${quest.completed ? s.completed : ''} ${quest.claimed ? s.claimed : ''}`}>
              <div className={s.questInfo}>
                <h3>{quest.name}</h3>
                <p>{quest.description}</p>
                <div className={s.progressBar}>
                  <div
                    className={s.progressFill}
                    style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                  />
                  <span>{quest.current} / {quest.target}</span>
                </div>
                <span className={s.reward}>🎁 {quest.rewardAmount} {quest.rewardType === 'energy' ? '⚡' : '💀'}</span>
              </div>
              {quest.completed && !quest.claimed && (
                <button
                  className={s.claimBtn}
                  onClick={() => claimQuestReward(quest.id)}
                >
                  Забрать
                </button>
              )}
              {quest.claimed && <span className={s.claimedLabel}>✅ Получено</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Quests;