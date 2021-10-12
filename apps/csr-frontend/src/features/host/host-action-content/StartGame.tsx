import { Button } from '@whosaidtrue/ui';
import { types } from '@whosaidtrue/api-interfaces';
import useSocket from '../../socket/useSocket';
import { useAppDispatch } from '../../../app/hooks';
import { showError } from '../..';

const StartGame: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();

    const handler = () => {
        sendMessage(types.START_GAME, undefined, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'))
            }
        })
    }

    return <Button onClick={handler}>Start Game</Button>
}

export default StartGame;