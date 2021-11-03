import { Button } from '@whosaidtrue/ui';
import { setFullModal } from '../modal/modalSlice';
import { setShouldBlock } from '../game/gameSlice';
import { useAppDispatch } from '../../app/hooks';

const HostGameOptionsButtons: React.FC = () => {
    const dispatch = useAppDispatch();

    const confEndGame = () => {
        dispatch(setShouldBlock(false));
        dispatch(setFullModal('confirmEndGame'))
    }
    return (
        <div className="flex flex-col gap-4 px-6">
            <Button type="button" onClick={() => dispatch(setFullModal('removePlayers'))} buttonStyle="big-text" $secondary>Remove Player(s)</Button>
            <Button type="button" onClick={confEndGame} buttonStyle="big-text" $secondary>End Game</Button>
        </div>
    )
}

export default HostGameOptionsButtons;