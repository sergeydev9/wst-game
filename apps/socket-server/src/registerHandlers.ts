import { Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { gamePlayers } from './db';


const registerHandlers = (socket: Socket) => {

    // send message to all other clients connected to the game room
    const sendToGame = (type: string, payload: unknown) => {
        socket.to(`${socket.gameId}`).emit(type, payload)
    }

    // on player join, just rebroadcast
    socket.on(types.PLAYER_JOINED_GAME, (msg: payloads.PlayerEvent) => {
        sendToGame(types.PLAYER_JOINED_GAME, msg)
    })

    // on remove player, remove from redis state and DB, then rebroadcast
    socket.on(types.REMOVE_PLAYER, (msg: payloads.PlayerEvent, ack) => {
        // TODO: redis state update
        sendToGame(types.REMOVE_PLAYER, msg);
        ack('ok')
    })
}

export default registerHandlers;