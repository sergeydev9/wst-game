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
    selectGameId,
    selectPlayerId,
    showError,
    selectGameStatus
} from '..';
import { showPlayerJoined, showPlayerLeft, showPlayerRemoved, setFullModal } from "../modal/modalSlice";
import { addPlayer, clearGame, removePlayer, setInactive, gameStateUpdate, setGameResults } from "../game/gameSlice";
import { clearCurrentQuestion, setCurrentQuestion, setResults, setReader, setAnswersPending } from "../question/questionSlice";
import { GameStateUpdate, PlayerJoinedGame, PlayerLeftGame, RemovePlayer, SetGameResults, SetQuestionResult, SetQuestionState, SetReader, UpdateAnswersPending, UpdateInactivePlayers } from "@whosaidtrue/api-interfaces";

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
    const gameId = useAppSelector(selectGameId);
    const playerId = useAppSelector(selectPlayerId);
    const accessCode = useAppSelector(selectAccessCode);
    const token = useAppSelector(selectGameToken);

    useEffect(() => {

        // if game status is one of these values, then user should have a socket connection
        const shouldHaveConnection = ['inProgress', 'lobby', 'postGame', 'gameCreateSuccess', 'choosingName'].includes(gameStatus);

        // if user should, but doesn't, have a socket connection, create one and register listeners
        if (shouldHaveConnection && !socket) {

            const conn = io(process.env.NX_SOCKET_BASEURL as string,
                {
                    auth: { token: { game_code: accessCode, player_id: playerId } }, // TODO: replace with actual token when socket server implements decoding,
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
            conn.on('PlayerJoinedGame', (message: PlayerJoinedGame) => {
                const { id, player_name } = message.payload;

                dispatch(showPlayerJoined(player_name))
                dispatch(addPlayer({ id, player_name }))
            })

            conn.on('PlayerLeftGame', (message: PlayerLeftGame) => {
                const { id, player_name } = message.payload;

                dispatch(showPlayerLeft(player_name))
                dispatch(removePlayer(id))
            })

            conn.on('RemovePlayer', (message: RemovePlayer) => {
                const { id, player_name } = message.payload;

                if (playerId === id) {
                    // If current player is the one that was removed
                    dispatch(setFullModal("removedFromGame")) // show modal
                    dispatch(clearGame()); // clear state
                    dispatch(clearCurrentQuestion())
                    conn.close() // close socket
                    history.push('/') // nav home

                    // otherwise, show goodbye message
                } else {
                    dispatch(showPlayerRemoved(player_name));
                    dispatch(removePlayer(id))
                }
            })

            conn.on('UpdateInactivePlayers', (message: UpdateInactivePlayers) => {
                const { inactivePlayers } = message.payload;
                dispatch(setInactive(inactivePlayers))
            })

            conn.on('SetQuestionState', (message: SetQuestionState) => {
                dispatch(setCurrentQuestion(message.payload))
            })

            conn.on('GameStateUpdate', (message: GameStateUpdate) => {
                dispatch(gameStateUpdate(message.payload))
            })

            conn.on('SetQuestionResult', (message: SetQuestionResult) => {
                dispatch(setResults(message.payload))
            })

            conn.on('SetReader', (message: SetReader) => {
                dispatch(setReader(message.payload))
            })

            conn.on('UpdateAnswersPending', (message: UpdateAnswersPending) => {
                dispatch(setAnswersPending(message.payload))
            })

            conn.on('SetGameResults', (message: SetGameResults) => {
                dispatch(setGameResults(message.payload))
            })

            // move playe to game page if they should be there but aren't
            if (['inProgress', 'lobby', 'postGame'].includes(gameStatus) && location.pathname !== '/play') {
                history.push('/play');
            }

            // if user shouldn't have a game connection but does for some reason, close it.
        } else if (!shouldHaveConnection && socket) {
            socket.close();
        }
    }, [history, token, setSocket, accessCode, playerId, dispatch, gameStatus, socket, location])

    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}

export default SocketProvider;