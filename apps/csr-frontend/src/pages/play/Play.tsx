import { useEffect, useMemo } from 'react';
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
    selectFullModal,
    useSocket
} from '../../features';

const Play: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { socket, setSocket } = useSocket();
    const playerStatus = useAppSelector(selectPlayerStatus);
    const isHost = useAppSelector(selectIsHost);
    const gameStatus = useAppSelector(selectGameStatus);
    const modal = useAppSelector(selectFullModal)

    // memoize to prevent re-rendering every time modal changes
    const shouldBlock = useMemo(() => {
        return modal !== 'confirmEndGame'
    }, [modal])

    useEffect(() => {

        // show confirmation dialog and clear game state if confirmed
        const unblock = history.block((...args: any[]) => {

            // DEV_NOTE: react-router-dom's type definitions are incorrect at the moment, so any type
            // has to be used here to prevent compiler errors
            // args[0] is a location object, and args[1] is a navigation action type
            if (shouldBlock) {
                const confirmMessage = isHost ? 'Are you sure you want to leave? Since you are the host, this will end the game for everyone' :
                    'Are you sure you want to leave the game?';

                if (window.confirm(confirmMessage)) {
                    dispatch(clearGame());
                    dispatch(clearCurrentQuestion());
                    return true;
                }

                return false
            }
            return true
        })

        // close socket when leaving
        return () => {
            if (socket) {
                socket.close();
                setSocket(null);
            }
            unblock();
        }
    }, [dispatch, isHost, history, setSocket, socket, shouldBlock])

    return (
        <>
            {playerStatus === "lobby" && <Lobby />}
            {playerStatus === 'inGame' && gameStatus === 'inProgress' && <Question />}
            {isHost && <HostActions />}
        </>
    )
}

export default Play