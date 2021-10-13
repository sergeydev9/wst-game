import { Server, Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { logger, logIncoming, logOutgoing, logError } from '@whosaidtrue/logger';
import { playerValueString } from './util';
import { pubClient } from "./redis";
import { ONE_DAY } from "./constants";
import startGame from "./listener-helpers/startGame";
import submitAnswerPart1 from "./listener-helpers/submitAnswerPart1";
import submitAnswerPart2 from "./listener-helpers/submitAnswerPart2";


const registerListeners = (socket: Socket, io: Server) => {
    const { currentPlayers, removedPlayers, currentSequenceIndex, totalQuestions } = socket.keys

    // handle disconnect
    socket.on('disconnect', async () => {
        const res = await pubClient.srem(currentPlayers, playerValueString(socket));
        logger.debug(`number of players removed in disconnect handler: ${res}`);
    })

    /**
     * MESSAGE HELPERS
     */
    // send to connected clients excluding sender
    const sendToOthers = (type: string, payload: unknown) => {
        socket.to(`${socket.gameId}`).emit(type, payload)
        logOutgoing(type, payload, "others");
    }

    // send to connected clients including sender
    const sendToAll = (type: string, payload: unknown) => {
        io.to(`${socket.gameId}`).emit(type, payload);
        logOutgoing(type, payload, "all");
    }

    /**
     * EVENT LISTENERS
     */

    // on player join, just rebroadcast
    socket.on(types.PLAYER_JOINED_GAME, (msg: payloads.PlayerEvent) => {
        sendToOthers(types.PLAYER_JOINED_GAME, msg)
    })

    // submit true false
    socket.on(types.ANSWER_PART_1, async (msg: payloads.AnswerPart1, cb) => {
        logIncoming(types.ANSWER_PART_1, msg);

        try {
            await submitAnswerPart1(socket, msg);
            cb('ok')
        } catch (e) {
            logError('[answerPart1] error submiting answer.', e);
            cb('error submitting anser');
        }
    })

    // submit guess
    socket.on(types.ANSWER_PART_2, async (msg: payloads.AnswerPart2, cb) => {
        logIncoming(types.ANSWER_PART_2, msg)

        try {
            const pendingList = await submitAnswerPart2(socket, msg)

            // send new list of players that haven't answered yet
            sendToAll(types.SET_HAVE_NOT_ANSWERED, pendingList)

            if (!pendingList.length) {
                const current = await pubClient.get(currentSequenceIndex)
                const total = await pubClient.get(totalQuestions)

                // if last question, move to game results
                if (current === total) {
                    console.log('last question')
                } else {
                    // else move to question results

                }
            }

            cb('ok')
        } catch (e) {
            logError('[submitAnswerPart2] Error', e)
            cb('error')
        }
    })

    /**
     * HOST ONLY LISTENERS
     */
    if (socket.isHost) {

        // Start game when host presses button
        socket.on(types.START_GAME, async (_, cb) => {

            try {
                // update and fetch data from db
                const startResult = await startGame(socket);
                const { game, question, currentCount, haveNotAnswered } = startResult;

                // send question and game state to players
                sendToAll(types.UPDATE_GAME_STATUS, game.status);
                sendToAll(types.SET_QUESTION_STATE, {
                    ...question,
                    haveNotAnswered,
                    numPlayers: currentCount,
                    status: 'question'
                } as payloads.SetQuestionState)

            } catch (e) {
                logError(`Error while starting  game: ${socket.gameId}.`, e)
                cb('error')
            }
        })

        // on remove player, remove from redis state, then rebroadcast
        socket.on(types.REMOVE_PLAYER, async (msg: payloads.PlayerEvent) => {
            logIncoming(types.REMOVE_PLAYER, msg)

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