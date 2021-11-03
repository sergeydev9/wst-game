import { useState } from 'react';
import { Button } from '@whosaidtrue/ui';
import { types } from '@whosaidtrue/api-interfaces';
import useSocket from '../../socket/useSocket';
import { useAppDispatch } from '../../../app/hooks';
import { showError, showLoaderMessage, clearLoaderMessage } from '../../modal/modalSlice';

const StartGame: React.FC = () => {
    const dispatch = useAppDispatch();
    const [enabled, setEnabled] = useState(true);
    const { sendMessage } = useSocket();

    const handler = () => {
        dispatch(showLoaderMessage('Starting game'))

        setEnabled(false);

        sendMessage(types.START_GAME, undefined, (ack) => {
            dispatch(clearLoaderMessage())

            if (ack !== 'ok') {
                dispatch(showError('Oops, something went wrong...'))
                setEnabled(true)
            }
        })
    }

    return <Button disabled={!enabled} onClick={handler}>Start Game</Button>
}

export default StartGame;