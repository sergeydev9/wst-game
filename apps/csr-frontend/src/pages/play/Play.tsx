import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    Lobby,
    selectIsHost,
    selectPlayerStatus,
    HostActions,
    selectGameStatus,
    Question,
    clearGame,
    clearCurrentQuestion,
    selectFullModal
} from '../../features';

const Play: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const playerStatus = useAppSelector(selectPlayerStatus);
    const isHost = useAppSelector(selectIsHost);
    const gameStatus = useAppSelector(selectGameStatus);

    useEffect(() => {

        // show confirmation dialog and clear game state if confirmed
        const unblock = history.block((...args: any[]) => {

            // DEV_NOTE: react-router-dom's type definitions are incorrect at the moment, so any type
            // has to be used here to prevent compiler errors
            // args[0] is a location object, and args[1] is a navigation action type
            if (args[0].pathname as any !== '/play') {
                const confirmMessage = isHost ? 'Are you sure you want to leave? Since you are the host, this will end the game for everyone' :
                    'Are you sure you want to leave the game?';

                if (window.confirm(confirmMessage)) {
                    unblock();
                    dispatch(clearGame());
                    dispatch(clearCurrentQuestion());
                    return true;
                }

                return false
            }
            return true
        })


    }, [dispatch, isHost, history])

    return (
        <>
            {playerStatus === "lobby" && <Lobby />}
            {playerStatus === 'inGame' && gameStatus === 'inProgress' && <Question />}
            {isHost && <HostActions />}
        </>
    )
}

export default Play