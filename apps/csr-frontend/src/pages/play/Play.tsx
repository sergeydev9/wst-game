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
    currentScreen,
    useSocket,
    FinalResults,
    isLoggedIn,
    checkHasRatedApp,
    selectAppRatingChecked,
    clearScoreTooltipDismissed,
} from '../../features';
import { setReconnecting, setConnecting, selectConnecting } from '../../features/modal/modalSlice';

const Play: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { socket, setSocket, shouldBlock } = useSocket();
    const playerStatus = useAppSelector(selectPlayerStatus);
    const isHost = useAppSelector(selectIsHost);
    const gameStatus = useAppSelector(selectGameStatus);
    const loggedIn = useAppSelector(isLoggedIn);
    const ratingChecked = useAppSelector(selectAppRatingChecked);
    const connecting = useAppSelector(selectConnecting);
    const screen = useAppSelector(currentScreen);


    useEffect(() => {

        // if user is logged in, and a request hasn't been made to check if they have rated the app
        // send the request.
        if (loggedIn && !ratingChecked) {
            dispatch(checkHasRatedApp());
        }


        if (socket && !socket.connected) {
            dispatch(setConnecting(true))
        }


        let unblock: () => void;

        if (playerStatus === 'removed') {
            dispatch(clearGame());
            dispatch(clearCurrentQuestion());
            history.push('/');
        } else if (shouldBlock) {
            unblock = history.block((...args: any[]) => {

                // DEV_NOTE: react-router-dom's type definitions are incorrect at the moment, so any type
                // has to be used here to prevent compiler errors
                // args[0] is a location object, and args[1] is a navigation action type

                const path = args[0].pathname as any
                if (path !== '/play') {
                    const confirmMessage = isHost ? 'Are you sure you want to leave? Since you are the host, this will end the game for everyone' :
                        'Are you sure you want to leave the game?';

                    if (window.confirm(confirmMessage)) {
                        dispatch(clearGame());
                        dispatch(clearCurrentQuestion());

                        return true;
                    }

                    dispatch(clearScoreTooltipDismissed());
                    return false
                } else {
                    return false
                }

            })
        }

        // close socket when leaving
        return () => {
            unblock && unblock();
            dispatch(setReconnecting(false)) // stops any connecting modals from showing after user leaves
            dispatch(setConnecting(false))
        }
    }, [dispatch, isHost, history, setSocket, socket, shouldBlock, loggedIn, ratingChecked, playerStatus, connecting])

    return (
        <>
            {playerStatus === "lobby" && gameStatus !== 'postGame' && <Lobby />}
            {playerStatus === 'inGame' && gameStatus === 'inProgress' && <Question />}
            {gameStatus === 'postGame' && <FinalResults />}
            {isHost && gameStatus !== 'postGame' && screen !== 'guess' && <HostActions />}
        </>
    )
}

export default Play