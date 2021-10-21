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
    useSocket,
    FinalResults,
    isLoggedIn,
    checkHasRatedApp,
    selectAppRatingChecked,
    clearScoreTooltipDismissed,
    selectShouldBlock
} from '../../features';

const Play: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { socket, setSocket } = useSocket();
    const playerStatus = useAppSelector(selectPlayerStatus);
    const isHost = useAppSelector(selectIsHost);
    const gameStatus = useAppSelector(selectGameStatus);
    const loggedIn = useAppSelector(isLoggedIn);
    const ratingChecked = useAppSelector(selectAppRatingChecked);
    const shouldBlock = useAppSelector(selectShouldBlock);


    useEffect(() => {

        // if user is logged in, and a request hasn't been made to check if they have rated the app
        // send the request.
        if (loggedIn && !ratingChecked) {
            dispatch(checkHasRatedApp());
        }
        let unblock: () => void | undefined;

        if (shouldBlock) {
            unblock = history.block((_) => {

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
                dispatch(clearScoreTooltipDismissed());
                return true
            })
        }
        // show confirmation dialog and clear game state if confirmed


        // close socket when leaving
        return () => {
            if (socket) {
                socket.close();
                setSocket(null);
            }
            if (unblock) {
                unblock();

            }
        }
    }, [dispatch, isHost, history, setSocket, socket, shouldBlock, loggedIn, ratingChecked])

    return (
        <>
            {playerStatus === "lobby" && <Lobby />}
            {playerStatus === 'inGame' && gameStatus === 'inProgress' && <Question />}
            {gameStatus === 'postGame' && <FinalResults />}
            {isHost && gameStatus !== 'postGame' && <HostActions />}
        </>
    )
}

export default Play