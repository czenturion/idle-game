import useGameStore from '../../../store/gameStore';
import { PixelCard, PixelProgress } from '@pxlkit/ui-kit';

const ProgressBar = ({ max = 100 }) => {
    const progress = useGameStore((state) => state.progress);
    const energy = useGameStore((state) => state.energy);

    return (
        <PixelCard>
            <p>Энергия: {energy}</p>
            <PixelProgress value={progress} max={max} tone='green'/>
        </PixelCard>
    )
}

export default ProgressBar;