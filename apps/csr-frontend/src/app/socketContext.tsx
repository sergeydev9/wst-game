import { useState, useContext } from "react";
import { createContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { RootState } from "./store";
import { useAppSelector, useAppDispatch } from './hooks';
import {
    selectGameToken,
    selectAccessCode,
    showInfo,
    showSuccess,
    selectGameId,
    selectPlayerId,
    showError
} from '../features';

// Create socket context
export const socketContext = createContext<Socket | null>(null);


/**
 * Provider component for socket context.
 *
 * Components that consume socket context must be nested within
 * this provider
 */
export const SocketProvider: React.FC = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const history = useHistory();
    const dispatch = useAppDispatch();
    const gameId = useAppSelector(selectGameId);
    const playerId = useAppSelector(selectPlayerId);
    const accessCode = useAppSelector(selectAccessCode);
    const token = useAppSelector(selectGameToken);

    useEffect(() => {
        const stateString = localStorage.getItem('wstState')

        if (stateString) {
            const state = JSON.parse(stateString) as RootState;

            // if user is in game, connect using token from store and move them to game screen
            if (state.game.status === 'lobby' || state.game.status === 'in-game') {
                const conn = io(process.env.NX_SOCKET_BASEURL as string,
                    {
                        auth:
                        {
                            token: { game_code: accessCode, player_id: playerId } // TODO: replace with actual token when socket server implements decoding
                        },
                        rememberUpgrade: true,
                        reconnectionAttempts: 4,
                        reconnectionDelay: 3000
                    });

                setSocket(conn);

                conn.on("connect", () => {
                    console.log('Game server connection successful!') // connection success
                })

                conn.on("connect_error", () => {
                    dispatch(showError('Could not connect to game server')) // initial connection failed
                })

                conn.on("disconnect", () => {
                    console.log('Disconnected from game server') // disconnected from game server. Could happen if player leaves, or is removed.
                })

                conn.io.on("reconnect_attempt", () => {
                    dispatch(showInfo(`Reconnecting to game server...`)) // reconnecting
                })

                conn.io.on("reconnect_failed", () => {
                    dispatch(showError('Could not reconnect to game server.')) // when all reconnect attempts have failed
                })

                conn.io.on('reconnect', () => {
                    dispatch(showSuccess('Reconnected to game server!')) // reconnect success
                })

                history.push('/play')
            }
        }

    }, [history, token, setSocket, accessCode, playerId, dispatch])

    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}


/**
 * Custom hook that can be used to set or retrieve the socket connection.
 *
 * @example
 *
 * const MyComponent = () => {
 *   const socket = useSocket()
 *
 *   const sendMessage = () => {
 *     socket.emit("myMessage")
 *   }
 *
 *   ...
 * }
 */
export const useSocket = () => {
    const context = useContext(socketContext);

    if (!context) {
        throw new Error('useSocket hook must be used within socket context provider')
    }

    return context
}