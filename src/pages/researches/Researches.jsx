import { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { maxUpgradesCost } from './../../shared/helpers/gameMath.js';
import {
  PixelCard,
  PixelButton,
  PixelBadge,
  PixelSectionHeader,
} from '@pxlkit/ui-kit';
import s from './Researches.module.css';

function Researches() {
  const stats = useGameStore((state) => state.stats);
  const energy = useGameStore((state) => state.energy);
  const souls = useGameStore((state) => state.souls);
  const currentUpgradeCost = useGameStore((state) => state.currentUpgradeCost);
  const increaseStat = useGameStore((state) => state.increaseStat)
  const buySoulUpgrade = useGameStore((state) => state.buySoulUpgrade)
  const soulUpgrades = useGameStore((state) => state.soulUpgrades)
  const fillSpeed = useGameStore((state) => state.fillSpeed);

  const [activeTab, setActiveTab] = useState('energy');
  const [feedback, setFeedback] = useState({})

  const flash = (key, success) => {
    setFeedback((prev) => ({ ...prev, [key]: success ? 'success' : 'error' }))
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [key]: null }))
    }, 400)
  }

  const handleUpgrade = (statName) => {
    const ok = increaseStat(statName)
    flash(`stat_${statName}`, ok)
  }

  const handleSoulUpgrade = (upgradeId) => {
    const ok = buySoulUpgrade(upgradeId)
    flash(`soul_${upgradeId}`, ok)
  }

  const costFor5 = (currentUpgradeCost + (currentUpgradeCost + 4)) * 5 / 2
  const costMax = maxUpgradesCost(energy, currentUpgradeCost)

  const cls = (key) => `${feedback[key] === 'success' ? s.success : ''} ${feedback[key] === 'error' ? s.error : ''}`

  return (
    <div className={s.researchContainer}>
      <PixelSectionHeader
        title='Исследования'
        description='Страница для прокачки персонажа и игрового процесса'
        tone='green'
      />
      <div className={s.tabs}>
        <PixelButton
          tone={activeTab === 'energy' ? 'green' : 'neutral'}
          onClick={() => setActiveTab('energy')}
        >
          Энергия
        </PixelButton>
        <PixelButton
          tone={activeTab === 'soul' ? 'purple' : 'neutral'}
          onClick={() => setActiveTab('soul')}
        >
          Души
        </PixelButton>
      </div>

      {
        activeTab === 'energy' && (
          <div className={s.container}>
            <PixelCard className={s.header}>
              <span>Доступно энергии: </span>
              <span tone="green">{energy}</span >
            </PixelCard>
            <div className={s.tabContent}>

              {[
                { key: 'str', label: '⚔️ Сила', value: stats.str },
                { key: 'def', label: '🛡️ Защита', value: stats.def },
                { key: 'hp', label: '❤️ Здоровье', value: stats.hp },
              ].map(({ key, label, value }) => (
                <PixelCard key={key} title={label}>
                  <div className={s.statRow}>
                    Уровень:
                    <span className={s.statValue}>{value}</span>
                  </div>

                  <div className={s.actionsCol}>
                    <PixelButton
                      tone='green'
                      className={cls(`stat_${key}`)}
                      onClick={() => handleUpgrade(key)}
                      disabled={energy < currentUpgradeCost}
                    >
                      +1 · {currentUpgradeCost}🔋
                    </PixelButton>
                    <PixelButton
                      tone="cyan"
                      disabled
                    >
                      +5 · {costFor5}🔋
                    </PixelButton>
                    <PixelButton
                      tone="gold"
                      disabled
                    >
                      Макс · {costMax}🔋
                    </PixelButton>
                  </div>
                </PixelCard>
              ))}
            </div>
          </div>
        )
      }

      {
        activeTab === 'soul' && (
          <div className={s.container}>
            <PixelCard className={s.header}>
              <span>Доступно душ: </span>
              <span tone="purple">{souls}</span >
            </PixelCard>
            <div className={s.soulList}>
              {
                soulUpgrades.map((up) => {
                  const cost = Math.floor(up.baseCost * Math.pow(up.costMultiplier, up.level))
                  const maxed = up.level >= up.maxLevel
                  const canAfford = souls >= cost && !maxed

                  return (
                    <PixelCard
                      key={up.id}
                      title={up.name}
                    >
                      <p className={s.desc}>{up.description}</p>
                      <br />
                      <div className={s.soulRow}>
                        <span>
                          Уровень:
                          <br />
                          <b>{up.level}/</b>{up.maxLevel}
                          <br />
                        </span>
                        <span>
                          Стоимость:{' '}
                          {maxed ? (<PixelBadge tone="gold">MAX</PixelBadge>) : (
                            <PixelBadge tone="purple">💀 {cost}</PixelBadge>
                          )}
                        </span>
                        <PixelButton
                          tone='purple'
                          className={cls(`soul_${up.id}`)}
                          onClick={() => handleSoulUpgrade(up.id)}
                          disabled={!canAfford}
                        >
                          {maxed ? 'Максимум' : 'Купить'}
                        </PixelButton>
                      </div>
                    </PixelCard>)
                })
              }
            </div>
          </div>
        )
      }

    </div>
  );
}

export default Researches;