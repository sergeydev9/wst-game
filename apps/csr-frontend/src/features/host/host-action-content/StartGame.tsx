import { Button } from '@whosaidtrue/ui';
import { types } from '@whosaidtrue/api-interfaces';
import useSocket from '../../socket/useSocket';

const StartGame: React.FC = () => {
    const { sendMessage } = useSocket();

    const handler = () => {
        sendMessage(types.START_GAME)
    }

    return <Button onClick={handler}>Start Game</Button>
}

export default StartGame;