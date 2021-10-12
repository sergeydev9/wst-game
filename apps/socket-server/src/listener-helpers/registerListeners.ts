import { Server, Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { logger } from '@whosaidtrue/logger';
import { playerValueString } from '../util';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { answers } from '../db';
import startGame from "./startGame";


const registerListeners = (socket: Socket, io: Server) => {

    const { currentPlayers, hasPassed, answerIds, removedPlayers } = socket.keys


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

    // submit true false
    socket.on(types.ANSWER_PART_1, async (msg: payloads.AnswerPart1, cb) => {
        logger.debug(`Answer Part 1: ${JSON.stringify(msg)}`)
        try {

            // prevent passing more than once per game
            if (msg.answer === 'pass') {

                if (await pubClient.get(`${socket.keys.hasPassed}`)) {
                    cb('cannot pass again')
                    return;
                }

                // mark player as having passed
                await pubClient.set(`${hasPassed}`, 1, 'EX', ONE_DAY)
            }

            // submit answer
            const { rows } = await answers.submitValue(
                socket.playerId,
                msg.gameQuestionId,
                socket.gameId,
                msg.answer,
            )

            // set answer id in redis for re-use in part 2
            await pubClient.set(`${answerIds}:${msg.gameQuestionId}`, rows[0].id, 'EX', ONE_DAY)

        } catch (e) {
            console.error(`[answerPart1] error submiting answer. Error: ${e}`)
            cb('error submitting anser')
        }

        cb('ok')
    })

    // submit guess
    // socket.on(types.ANSWER_PART_2, async (msg: payloads.AnswerPart2) => {

    // })

    /**
     * HOST ONLY LISTENERS
     */

    if (socket.isHost) {

        // Start game when host presses button
        socket.on(types.START_GAME, async (_, cb) => {

            try {
                const startResult = await startGame(socket);
                const { game, question, currentCount, haveNotAnswered } = startResult;

                // send question and game state to players
                sendToAll(types.UPDATE_GAME_STATUS, game.status)
                sendToAll(types.SET_QUESTION_STATE, {
                    ...question,
                    haveNotAnswered,
                    numPlayers: currentCount,
                    status: 'question'
                } as payloads.SetQuestionState)
            } catch (e) {
                logger.error(`Error while starting  game: ${socket.gameId}. Error: ${e}`)
                cb('error')
            }


        })

        // on remove player, remove from redis state, then rebroadcast
        socket.on(types.REMOVE_PLAYER, async (msg: payloads.PlayerEvent) => {

            // add player to removed players set
            const remResponse = await pubClient.sadd(removedPlayers, msg.id);
            await pubClient.expire(removedPlayers, ONE_DAY);

            logger.debug(`Player added to removed list: ${remResponse}`)

            // remove player from current players
            await pubClient.srem(currentPlayers, JSON.stringify(msg)); // remove from redis
            sendToAll(types.REMOVE_PLAYER, msg);
        })
    }
}

export default registerListeners;