import useGameStore from '../../../store/gameStore';
import { PixelCard, PixelProgress } from '@pxlkit/ui-kit';
import s from './ProgressBar.module.css'

const ProgressBar = ({ max = 100 }) => {
    const progress = useGameStore((state) => state.progress);
    const energy = useGameStore((state) => state.energy);

    return (
        <PixelCard>
            <p className={s.title}>Энергия: {energy}</p>
            <div className={s.pb}>
                <PixelProgress value={progress} max={max} tone='green' />
            </div>
        </PixelCard>
    )
}

export default ProgressBar;