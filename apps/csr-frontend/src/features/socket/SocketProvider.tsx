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
    setGameResults,
    selectPlayerName,
    selectPlayerStatus,
    selectGameStatus,
    setPlayers,
    setPlayerStatus
} from "../game/gameSlice";
import { clearCurrentQuestion, setCurrentQuestion, setResults, setReader, setAnswersPending } from "../question/questionSlice";
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

            const conn = io(
                process.env.NX_SOCKET_BASEURL as string,
                {
                    auth: { token },
                    rememberUpgrade: true,
                    reconnectionAttempts: 4,
                    reconnectionDelay: 2500
                });

            setSocket(conn); // add socket to provider

            /**
            * CONNECTION LISTENERS
            */
            conn.on("connect", () => {
                console.log('Game server connection successful!'); // connection success
                conn.emit(types.PLAYER_JOINED_GAME, { id: playerId, player_name: playerName })
            })

            conn.on("connect_error", () => {
                dispatch(showError('Could not connect to game server')); // initial connection failed
            })

            conn.on("disconnect", () => {
                console.log('Disconnected from game server'); // disconnected from game server. Could happen if player leaves, or is removed.
            })

            conn.io.on("reconnect_attempt", () => {
                dispatch(showInfo(`Reconnecting to game server...`)); // reconnecting
            })

            conn.io.on("reconnect_failed", () => {
                dispatch(showError('Could not reconnect to game server.')); // when all reconnect attempts have failed
            })

            conn.io.on('reconnect', () => {
                dispatch(showSuccess('Reconnected to game server!')); // reconnect success
            })

            /**
             * GAME EVENT LISTENERS
             */

            // game not found in DB
            conn.on(types.GAME_NOT_FOUND, () => {
                dispatch(clearGame());
                dispatch(clearHost());
                dispatch(showError('Error while connecting to game'));
                history.push('/')
            })

            // update list of currently connected players
            conn.on(types.SET_CURRENT_PLAYERS, (message: payloads.SetCurrentPlayers) => {
                dispatch(setPlayers(message))
            })

            // another player joined
            conn.on(types.PLAYER_JOINED_GAME, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                dispatch(showPlayerJoined(player_name))
                dispatch(addPlayer({ id, player_name }))
            })

            // another player left on purpose
            conn.on(types.PLAYER_LEFT_GAME, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                dispatch(showPlayerLeft(player_name))
                dispatch(removePlayer(id))
            })

            // remove player
            conn.on(types.REMOVE_PLAYER, (message: payloads.PlayerEvent) => {
                const { id, player_name } = message;

                if (playerId === id) {
                    // If current player is the one that was removed
                    dispatch(setFullModal("removedFromGame")) // show modal
                    dispatch(clearGame()); // clear state
                    dispatch(clearCurrentQuestion())
                    conn.close() // close  and delete the socket
                    setSocket(null);

                    history.push('/') // nav home
                } else {
                    // otherwise, show player has been removed message
                    dispatch(showPlayerRemoved(player_name));
                }
            })

            // updates the list of inactive players
            conn.on(types.UPDATE_INACTIVE, (message: payloads.UpdateInactivePlayers) => {
                const { inactivePlayers } = message;
                dispatch(setInactive(inactivePlayers))
            })

            // updates question state
            conn.on(types.SET_QUESTION_STATE, (message: payloads.SetQuestionState) => {
                dispatch(setCurrentQuestion(message))
                if (playerStatus === 'lobby' && message.status === 'question') {
                    dispatch(setPlayerStatus('inGame'))
                }
            })

            // set game status (e.g. 'inProgress', 'lobby', etc)
            conn.on(types.UPDATE_GAME_STATUS, (message: GameStatus) => {
                dispatch(setGameStatus(message))
            })

            // updates game state
            conn.on(types.SET_GAME_STATE, (message: payloads.SetGameState) => {
                dispatch(gameStateUpdate(message))

            })

            // updates results for current question.
            conn.on(types.SET_QUESTION_RESULTS, (message: payloads.SetQuestionResult) => {
                dispatch(setResults(message))
            })

            // updates the reader of the current question
            conn.on(types.SET_READER, (message: payloads.PlayerEvent) => {
                dispatch(setReader(message))
            })

            // updates the value of answers yet to be submitted for the current question
            conn.on(types.UPDATE_ANSWERS_PENDING, (message: payloads.UpdateAnswersPending) => {
                dispatch(setAnswersPending(message))
            })

            // sets final results for the game
            conn.on(types.SET_GAME_RESULTS, (message: payloads.SetGameResults) => {
                dispatch(setGameResults(message))
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