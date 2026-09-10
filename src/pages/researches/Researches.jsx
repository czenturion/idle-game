import { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { maxUpgradesCost } from './../../shared/helpers/gameMath.js';
import s from './Researches.module.css';

function Researches() {
    const { hp, def, str } = useGameStore((state) => state.stats);
    const {
        energy,
        currentUpgradeCost,
        increaseStat,
        souls,
        buySoulUpgrade,
        soulUpgrades,
        fillSpeed
    } = useGameStore((state) => state);

    const [activeTab, setActiveTab] = useState('energy');
    const [buttonFeedback, setButtonFeedback] = useState({})

    const handleUpgrade = (statName) => {
        const success = increaseStat(statName)
        setButtonFeedback((prev) => ({
            ...prev,
            [statName]: success ? 'success' : 'error'
        }))

        setTimeout(() => {
            setButtonFeedback((prev) => ({
                ...prev,
                [statName]: null
            }))
        }, 400)
    }

    const handleSoulUpgrade = (upgradeId) => {
        const success = buySoulUpgrade(upgradeId)
        setButtonFeedback((prev) => ({
            ...prev,
            [upgradeId]: success ? 'success' : 'error'
        }))
        setTimeout(() => {
            setButtonFeedback((prev) => ({
                ...prev,
                [upgradeId]: null
            }))
        }, 400)
    }

    const getButtonClass = (statName) => {
        const status = buttonFeedback[statName]
        return `${s.upgradeBtn} ${status === 'success' ? s.success : ''} ${status === 'error' ? s.error : ''}`
    }

    const costFor5 = (currentUpgradeCost + (currentUpgradeCost + 4)) * 5 / 2
    const costMax = maxUpgradesCost(energy, currentUpgradeCost)

    return (
        <div className={s.researchContainer}>
            <div className={s.researchHeading}>
                <h2>Исследования</h2>
            </div>
            <div className={s.tabs}>
                <button
                    className={`${s.tab} ${activeTab === 'energy' ? s.activeTab : ''}`}
                    onClick={() => setActiveTab('energy')}
                >
                    Энергия
                </button>
                <button
                    className={`${s.tab} ${activeTab === 'soul' ? s.activeTab : ''}`}
                    onClick={() => setActiveTab('soul')}
                >
                    Души
                </button>
            </div>

            {
                activeTab === 'energy' && (
                    <div className={s.tabContent}>
                        <div className={s.stats}>
                            <div className={s.statsContainer}>
                                <div className={s.statContainer}>
                                    <p>Сила</p>
                                    <p>{str}</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td
                                                    onClick={() => handleUpgrade('str')}
                                                    className={getButtonClass('str')}
                                                >
                                                    +1
                                                </td>
                                                <td>
                                                    {currentUpgradeCost}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    +5
                                                </td>
                                                <td>
                                                    {costFor5}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Макс
                                                </td>
                                                <td>
                                                    {costMax}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={s.statContainer}>
                                    <p>Защита</p>
                                    <p>{def}</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td
                                                    onClick={() => handleUpgrade('def')}
                                                    className={getButtonClass('def')}
                                                >
                                                    +1
                                                </td>
                                                <td>
                                                    {currentUpgradeCost}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    +5
                                                </td>
                                                <td>
                                                    {costFor5}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Макс
                                                </td>
                                                <td>
                                                    {costMax}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className={s.statContainer}>
                                    <p>Здоровье</p>
                                    <p>{hp}</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td
                                                    onClick={() => handleUpgrade('hp')}
                                                    className={getButtonClass('hp')}
                                                >
                                                    +1
                                                </td>
                                                <td>
                                                    {currentUpgradeCost}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    +5
                                                </td>
                                                <td>
                                                    {costFor5}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Макс
                                                </td>
                                                <td>
                                                    {costMax}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'soul' && (
                    <div className={s.tabContent}>
                        <p>Душ: {souls}</p>
                        {
                            soulUpgrades.map((upgrade) => {
                                const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level))
                                const maxed = upgrade.level >= upgrade.maxLevel
                                const canAfford = souls >= cost && !maxed
                                return (
                                    <div key={upgrade.id} className={s.soulUpgradeItem}>
                                        <div>
                                            <h4>{upgrade.name}</h4>
                                            <p>{upgrade.description}</p>
                                            <p>Уровень: {upgrade.level} / {upgrade.maxLevel}</p>
                                            <p>Стоимость: {maxed ? 'MAX' : cost}</p>
                                        </div>
                                        <button
                                            className={`${s.soulBuyBtn} ${buttonFeedback[upgrade.id] === 'success' ? s.success : ''} ${buttonFeedback[upgrade.id] === 'error' ? s.error : ''}`}
                                            onClick={() => handleSoulUpgrade(upgrade.id)}
                                            // disabled={!canAfford || maxed}
                                        >
                                            {maxed ? 'MAX' : 'Купить'}
                                        </button>
                                    </div>
                                )
                            })
                        }
                        <div className={s.energy}>
                            <h2>Добыча&nbsp;Энергии</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Колличество&nbsp;энергии&nbsp;за&nbsp;тик</td>
                                        <td>{fillSpeed}</td>
                                        <td>Добавить&nbsp;+1&nbsp;к&nbsp;количеству&nbsp;энергии&nbsp;за&nbsp;тик</td>
                                    </tr>
                                    <tr>
                                        <td>Скорость&nbsp;заполнения&nbsp;шкалы&nbsp;энергии</td>
                                        <td>{fillSpeed}</td>
                                        <td>Добавить&nbsp;+0.1&nbsp;к&nbsp;скорости&nbsp;энергии&nbsp;тика</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default Researches;