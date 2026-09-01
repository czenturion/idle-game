import { useEffect, useRef } from 'react';
import useGameStore from '../../../store/gameStore';
import s from './ProgressBar.module.css';

const ProgressBar = ({
    max = 100,
    color = '#4caf50',
    height = '60px',
    width = '100%',
    showPercent = false,
    className = ''
}) => {
    const value = useGameStore((state) => state.progress);
    const energy = useGameStore((state) => state.energy);

    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? (clampedValue / max) * 100 : 0;

    const fillStyle = {
        width: `${percentage}%`,
        backgroundColor: color,
        height: '6px',
    };

    const containerStyle = {
        width,
        height,
    };

    return (
        <div
            className={`${s.progressContainer} ${className} px-sans`}
            style={containerStyle}
            role='progressbar'
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
        >
            <p className={s.progressAmount}>Энергия: &nbsp; {energy}</p>
            <div
                className={s.progresFill}
                style={fillStyle}
            >
            </div>
        </div>
    )
}

export default ProgressBar;