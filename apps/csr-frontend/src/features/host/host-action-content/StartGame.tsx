import { useState } from 'react';
import { Button } from '@whosaidtrue/ui';
import { types } from '@whosaidtrue/api-interfaces';
import useSocket from '../../socket/useSocket';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showError, showLoaderMessage, clearLoaderMessage, showInfo } from '../../modal/modalSlice';
import { selectNumPlayersInGame } from '../../game/gameSlice';

const StartGame: React.FC = () => {
    const dispatch = useAppDispatch();
    const numPlayers = useAppSelector(selectNumPlayersInGame)
    const [enabled, setEnabled] = useState(true);
    const { sendMessage } = useSocket();

    const handler = () => {

        if (numPlayers <= 1) {
            dispatch(showInfo('Please wait until at least 1 other player has joined before starting the game.'))
        } else {
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
    }

    return <Button disabled={!enabled} onClick={handler}>Start Game</Button>
}

export default StartGame;