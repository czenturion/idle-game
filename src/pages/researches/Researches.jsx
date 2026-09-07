import { useState } from 'react';
import useGameStore from '../../store/gameStore';
import { maxUpgradesCost } from './../../shared/helpers/gameMath.js';
import s from './Researches.module.css';

function Researches() {
    const { hp, def, str } = useGameStore((state) => state.stats);
    const { energy, currentUpgradeCost, increaseStat } = useGameStore((state) => state);
    const [ buttonFeedback, setButtonFeedback ] = useState({})

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

    return (
        <div className={s.researchContainer}>
            <div className={s.researchHeading}>
                <h2>Исследования</h2>
            </div>

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
                                        className={`${s.upgradeBtn} ${buttonFeedback.hp === 'success' ? s.success : ''} ${buttonFeedback.hp === 'error' ? s.error : ''}`}
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
                                        {(currentUpgradeCost + (currentUpgradeCost + 4)) * 5 / 2}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Макс
                                    </td>
                                    <td>
                                        {maxUpgradesCost(energy, currentUpgradeCost)}
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
                                    <td onClick={() => increaseStat('def')}>
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
                                        {(currentUpgradeCost + (currentUpgradeCost + 4)) * 5 / 2}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Макс
                                    </td>
                                    <td>
                                        {maxUpgradesCost(energy, currentUpgradeCost)}
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
                                    <td onClick={() => increaseStat('hp')}>
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
                                        {(currentUpgradeCost + (currentUpgradeCost + 4)) * 5 / 2}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Макс
                                    </td>
                                    <td>
                                        {maxUpgradesCost(energy, currentUpgradeCost)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Researches;