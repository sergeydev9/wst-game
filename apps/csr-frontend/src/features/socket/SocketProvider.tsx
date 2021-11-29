import { useState } from "react";
import socketContext from "./socketContext";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectGameToken,
    selectAccessCode,
    showInfo,
    selectPlayerId,
    showError,
    isLoggedIn,
} from '..';
import {
    showPlayerJoined,
    showPlayerLeft,
    showPlayerRemoved,
    setFullModal,
    showLoaderMessage,
    clearLoaderMessage
} from "../modal/modalSlice";
import {
    addPlayer,
    clearGame,
    removePlayer,
    setGameStatus,
    selectPlayerName,
    selectPlayerStatus,
    selectGameStatus,
    setPlayers,
    setPlayerStatus,
    endGame,
    removeFromGame
} from "../game/gameSlice";
import {
    setCurrentQuestion,
    questionEnd,
    setReader,
    setHaveNotAnswered,
    setQuestionStatus,
} from "../question/questionSlice";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { GameStatus, SendMessageFunction } from "@whosaidtrue/app-interfaces";
import { setFunFacts, setMostSimilar, setFetchSimilarStatus } from '../fun-facts/funFactsSlice';

/**
 * Provider component for socket context.
 *
 * Components that consume socket context must be nested within
 * this provider
 *
 * All socket event listeners are registered here.
 */
export const SocketProvider: React.FC = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [shouldBlock, setShouldBlock] = useState(false)

    const location = useLocation();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const gameStatus = useAppSelector(selectGameStatus);
    const playerStatus = useAppSelector(selectPlayerStatus);
    const playerId = useAppSelector(selectPlayerId);
    const playerName = useAppSelector(selectPlayerName)
    const accessCode = useAppSelector(selectAccessCode);
    const token = useAppSelector(selectGameToken);
    const loggedIn = useAppSelector(isLoggedIn);



    useEffect(() => {
        const clear = () => {
            dispatch(clearLoaderMessage());
            setShouldBlock(false)
            dispatch(clearGame());
        }

        // if game status is one of these values, then user should have a socket connection
        const shouldHaveConnection = ['inGame', 'lobby', 'gameCreateSuccess', 'choosingName'].includes(playerStatus) && playerId;

        // if user should, but doesn't, have a socket connection, create one and register listeners
        if (shouldHaveConnection && !socket) {

            const connection = io(
                process.env.NX_SOCKET_BASEURL as string,
                {
                    auth: { token },
                    rememberUpgrade: true,
                    reconnectionAttempts: 4,
                    reconnectionDelay: 2500
                });

            setSocket(connection); // add socket to provider

            /**
            * CONNECTION LISTENERS
            */
            connection.on("connect", () => {
                dispatch(clearLoaderMessage());
                setShouldBlock(true);
                console.log('Game server connection successful!'); // connection success
                connection.emit(types.PLAYER_JOINED_GAME, { id: playerId, player_name: playerName });
            })

            connection.on("connect_error", () => {
                setShouldBlock(false);
                dispatch(showError('Could not connect to game server'))
                clear();
                history.push('/')
                connection.close() // close  and delete the socket
                setSocket(null);

            })

            // disconnected from game server.
            // see https://socket.io/docs/v3/client-socket-instance/ for list of reasons why this could happen
            connection.on("disconnect", reason => {
                setShouldBlock(false);

                console.log('Disconnected from game server');

                if (reason === 'ping timeout' || reason === 'transport close' || reason === 'transport error') {
                    dispatch(showLoaderMessage('Connection to server lost, reconnecting...'))
                    console.error(`Disconnected from game server. Reason: ${reason}`)

                } else {
                    clear();
                    connection.close() // close  and delete the socket
                    setSocket(null);
                }

            })

            connection.io.on("reconnect_attempt", () => {
                setShouldBlock(false)
            })

            connection.io.on("reconnect_failed", () => {
                console.log('reconnect failed')
                clear();
                history.push('/') // nav home
                connection.close() // close  and delete the socket
                setSocket(null);
            })

            connection.io.on('reconnect', () => {
                dispatch(showInfo('Reconnected. Welcome back!')); // reconnect success
                setShouldBlock(true);
            })

            /**
             * HELPERS
             */
            const fetchMostSimilar = () => {
                dispatch(setFetchSimilarStatus('loading'))

                connection.emit(types.FETCH_MOST_SIMILAR, {}, (cb: string | payloads.FetchMostSimilar) => {
                    if (cb === 'error' || typeof cb === 'string') {
                        dispatch(setFetchSimilarStatus('error'))
                    } else {
                        dispatch(setMostSimilar(cb))
                    }
                })
            }

            /**
             * GAME EVENT LISTENERS
             */
            // game not found in DB
            connection.on(types.GAME_NOT_FOUND, () => {
                clear()
                dispatch(showError('Error while connecting to game'));
                history.push('/')
            })

            // update list of currently connected players
            connection.on(types.SET_CURRENT_PLAYERS, (message: payloads.SetCurrentPlayers) => {
                dispatch(setPlayers(message))
            })

            // another player joined
            connection.on(types.PLAYER_JOINED_GAME, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                dispatch(showPlayerJoined(player_name))
                dispatch(addPlayer({ id, player_name }))
            })

            // another player left on purpose
            connection.on(types.PLAYER_LEFT_GAME, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                dispatch(showPlayerLeft(player_name))
                dispatch(removePlayer(id))
            })

            // remove player
            connection.on(types.REMOVE_PLAYER, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                if (playerId === id) {
                    // If current player is the one that was removed
                    dispatch(setFullModal("removedFromGame")) // show modal
                    dispatch(removeFromGame());
                    clear()
                    connection.close() // close connection. Component sets socket to null on dismount
                } else {
                    // otherwise, show player has been removed message
                    dispatch(showPlayerRemoved(player_name));
                    dispatch(removePlayer(id))

                }
            })

            // updates question state
            connection.on(types.SET_QUESTION_STATE, (message: payloads.SetQuestionState) => {
                dispatch(setCurrentQuestion(message));

                if (playerStatus === 'lobby' && message.status === 'question') {
                    dispatch(setPlayerStatus('inGame'))
                }
            })

            // set game status (e.g. 'inProgress', 'lobby', etc)
            connection.on(types.UPDATE_GAME_STATUS, (message: GameStatus) => {
                dispatch(setGameStatus(message))
            })

            // question is done, store results
            connection.on(types.QUESTION_END, (message: payloads.QuestionEnd) => {
                dispatch(questionEnd(message))
                fetchMostSimilar();
            })


            // updates the reader of the current question
            connection.on(types.SET_READER, (message: payloads.PlayerEvent) => {
                dispatch(setReader(message))
            })

            // updates the value of answers yet to be submitted for the current question
            connection.on(types.SET_HAVE_NOT_ANSWERED, (message: payloads.SetHaveNotAnswered) => {
                dispatch(setHaveNotAnswered(message))
            })

            // when host ends game by either disconnecting, or clicking the button.`
            // Skips the winner announcement.
            connection.on(types.GAME_END_NO_ANNOUNCE, (message: payloads.QuestionEnd) => {
                dispatch(setGameStatus('postGame'))
                dispatch(questionEnd(message))
                fetchMostSimilar();
            })

            // move from answer to scores at the end of a question
            connection.on(types.MOVE_TO_QUESTION_RESULTS, () => {
                dispatch(setQuestionStatus('results'))
            })

            connection.on(types.GAME_END, (message: payloads.QuestionEnd) => {
                dispatch(questionEnd(message))
                fetchMostSimilar();
                dispatch(endGame())
                dispatch(setFullModal('announceWinner'))
            })

            // player tries to join a game that is over
            connection.on(types.GAME_FINISHED, () => {
                dispatch(showError('The game you are attempting to join has already finished.'));
                clear();
                history.push('/');
                connection.close() // close  and delete the socket
                setSocket(null);
            })

            connection.on(types.HOST_LEFT, () => {
                if (gameStatus !== 'postGame') {
                    dispatch(showError('The host has left the game'));
                }
            })

            //if host left before first question was over
            connection.on(types.HOST_LEFT_NO_RESULTS, () => {
                dispatch(showError('The host has left the game'));
                clear();
                connection.close(); // close  and delete the socket
                setSocket(null);
                history.push('/')
            })

            connection.on(types.FUN_FACTS, (msg: payloads.FunFacts) => {
                dispatch(setFunFacts(msg))
            })


            // move playe to game page if they should be there but aren't
            if (['inProgress', 'lobby', 'postGame'].includes(gameStatus) && location.pathname !== '/play') {
                history.push('/play');
            }

            // if user shouldn't have a game connection but does for some reason, close it.
        } else if (!shouldHaveConnection && socket) {
            socket.close();
            setSocket(null);
        }
    }, [
        history,
        token,
        setSocket,
        accessCode,
        playerId,
        dispatch,
        gameStatus,
        socket,
        location,
        playerName,
        playerStatus,
        loggedIn
    ])


    // Send a message to the socket server, and passes acknowledgement to optional callback
    const sendMessage: SendMessageFunction = (type, payload, ack) => {
        if (!socket) {
            dispatch(showError('Could not connect to game'));
            return;
        }
        socket.emit(type, payload, ack)
    }

    return <socketContext.Provider value={{ socket, setSocket, sendMessage, shouldBlock, setShouldBlock }}>{children}</socketContext.Provider>
}

export default SocketProvider;