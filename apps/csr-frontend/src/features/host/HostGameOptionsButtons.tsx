import { Button } from '@whosaidtrue/ui';
import { setFullModal } from '../modal/modalSlice';
import useSocket from '../socket/useSocket'
import { useAppDispatch } from '../../app/hooks';

const HostGameOptionsButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const { setShouldBlock } = useSocket()

    const confEndGame = () => {
        setShouldBlock(false);
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