import { Server, Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { logger } from '@whosaidtrue/logger';
import { playerValueString } from '../util';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import startGame from "./startGame";


const registerListeners = (socket: Socket, io: Server) => {

    const currentPlayers = socket.keys.currentPlayers;
    const removedKey = socket.keys.removedPlayers;

    // handle disconnect
    socket.on('disconnect', async () => {

        const res = await pubClient.srem(currentPlayers, playerValueString(socket));
        logger.debug(`Players removed in disconnect listener: ${res}`)

    })

    // send to connected clients excluding sender
    const sendToOthers = (type: string, payload: unknown) => {
        socket.to(`${socket.gameId}`).emit(type, payload)
    }

    // send to connected clients including sender
    const sendToAll = (type: string, payload: unknown) => {
        io.to(`${socket.gameId}`).emit(type, payload);
    }

    // on player join, just rebroadcast
    socket.on(types.PLAYER_JOINED_GAME, (msg: payloads.PlayerEvent) => {
        sendToOthers(types.PLAYER_JOINED_GAME, msg)
    })

    /**
     * HOST ONLY LISTENERS
     */

    if (socket.isHost) {

        // Start game when host presses button
        socket.on(types.START_GAME, async () => {

            const startResult = await startGame(socket);
            const { game, question, currentCount } = startResult;

            // send question and game state to players
            sendToAll(types.UPDATE_GAME_STATUS, game.status)
            sendToAll(types.SET_QUESTION_STATE, { ...question, answersPending: currentCount, status: 'question' } as payloads.SetQuestionState)
        })

        // on remove player, remove from redis state, then rebroadcast
        socket.on(types.REMOVE_PLAYER, async (msg: payloads.PlayerEvent) => {

            // add player to removed players set
            const remResponse = await pubClient.sadd(removedKey, msg.id);
            await pubClient.expire(removedKey, ONE_DAY);

            logger.debug(`Player added to removed list: ${remResponse}`)

            // remove player from current players
            await pubClient.srem(currentPlayers, JSON.stringify(msg)); // remove from redis
            sendToAll(types.REMOVE_PLAYER, msg);
        })
    }
}

export default registerListeners;