import { Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { logger } from '@whosaidtrue/logger';
import { gamePlayers } from './db';
import { getGameKey, getCurrentPlayersKey, playerValueString } from './util';
import { pubClient } from "./redis";


const registerHandlers = (socket: Socket) => {

    const gameKey = getGameKey(socket)
    const currentPlayersKey = getCurrentPlayersKey(socket);

    // handle disconnect
    socket.on('disconnect', async () => {

        // remove from current players on disconnect
        const res = await pubClient.srem(currentPlayersKey, playerValueString(socket));
        logger.debug(`Remove player response: ${res}`)
    })

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