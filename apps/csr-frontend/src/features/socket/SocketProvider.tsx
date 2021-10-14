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
    showSuccess,
    selectPlayerId,
    showError,
} from '..';
import { showPlayerJoined, showPlayerLeft, showPlayerRemoved, setFullModal } from "../modal/modalSlice";
import {
    addPlayer,
    clearGame,
    removePlayer,
    setInactive,
    gameStateUpdate,
    setGameStatus,
    selectPlayerName,
    selectPlayerStatus,
    selectGameStatus,
    setPlayers,
    setPlayerStatus
} from "../game/gameSlice";
import { clearCurrentQuestion, setCurrentQuestion, questionEnd, setReader, setHaveNotAnswered, setQuestionStatus } from "../question/questionSlice";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { GameStatus, SendMessageFunction } from "@whosaidtrue/app-interfaces";
import { clearHost } from "../host/hostSlice";

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

    const location = useLocation();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const gameStatus = useAppSelector(selectGameStatus);
    const playerStatus = useAppSelector(selectPlayerStatus);
    const playerId = useAppSelector(selectPlayerId);
    const playerName = useAppSelector(selectPlayerName)
    const accessCode = useAppSelector(selectAccessCode);
    const token = useAppSelector(selectGameToken);

    useEffect(() => {

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
                console.log('Game server connection successful!'); // connection success
                connection.emit(types.PLAYER_JOINED_GAME, { id: playerId, player_name: playerName })
            })

            connection.on("connect_error", () => {
                dispatch(showError('Could not connect to game server')); // initial connection failed
            })

            connection.on("disconnect", () => {
                console.log('Disconnected from game server'); // disconnected from game server. Could happen if player leaves, or is removed.
            })

            connection.io.on("reconnect_attempt", () => {
                dispatch(showInfo(`Reconnecting to game server...`)); // reconnecting
            })

            connection.io.on("reconnect_failed", () => {
                dispatch(showError('Could not reconnect to game server.')); // when all reconnect attempts have failed
            })

            connection.io.on('reconnect', () => {
                dispatch(showSuccess('Reconnected to game server!')); // reconnect success
            })

            /**
             * GAME EVENT LISTENERS
             */

            // game not found in DB
            connection.on(types.GAME_NOT_FOUND, () => {
                dispatch(clearGame());
                dispatch(clearHost());
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
                    dispatch(clearGame()); // clear state
                    dispatch(clearCurrentQuestion())
                    connection.close() // close  and delete the socket
                    setSocket(null);

                    history.push('/') // nav home
                } else {
                    // otherwise, show player has been removed message
                    dispatch(showPlayerRemoved(player_name));
                }
            })

            // updates the list of inactive players
            connection.on(types.UPDATE_INACTIVE, (message: payloads.UpdateInactivePlayers) => {
                const { inactivePlayers } = message;
                dispatch(setInactive(inactivePlayers))
            })

            // updates question state
            connection.on(types.SET_QUESTION_STATE, (message: payloads.SetQuestionState) => {
                dispatch(setCurrentQuestion(message))
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
            })

            // move from answer to scores at the end of a question
            connection.on(types.MOVE_TO_QUESTION_RESULTS, () => {
                dispatch(setQuestionStatus('results'))
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


    }, [history, token, setSocket, accessCode, playerId, dispatch, gameStatus, socket, location, playerName, playerStatus])


    // Send a message to the socket server, and passes acknowledgement to optional callback
    const sendMessage: SendMessageFunction = (type, payload, ack) => {
        if (!socket) {
            dispatch(showError('Could not connect to game'));
            return;
        }
        socket.emit(type, payload, ack)
    }

    return <socketContext.Provider value={{ socket, setSocket, sendMessage }}>{children}</socketContext.Provider>
}

export default SocketProvider;