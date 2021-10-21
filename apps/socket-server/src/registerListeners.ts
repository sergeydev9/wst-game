import { Server, Socket } from "socket.io";
import { types, payloads } from "@whosaidtrue/api-interfaces";
import { games } from "./db";
import { logger, logIncoming, logOutgoing, logError } from '@whosaidtrue/logger';
import { playerValueString } from './util';
import { pubClient } from "./redis";
import { ONE_DAY } from "./constants";
import startGame from "./listener-helpers/startGame";
import submitAnswerPart1 from "./listener-helpers/submitAnswerPart1";
import submitAnswerPart2 from "./listener-helpers/submitAnswerPart2";
import saveScores from "./listener-helpers/saveScores";
import nextQuestion from "./listener-helpers/nextQuestion";
import endGame from './listener-helpers/endGame';


const registerListeners = (socket: Socket, io: Server) => {
    const {
        currentPlayers,
        removedPlayers,
        currentSequenceIndex,
        totalQuestions,
        gameStatus,
    } = socket.keys;

    // source info
    const source = {
        playerId: socket.playerId,
        playerName: socket.playerName,
        gameId: socket.gameId
    }

    // handle disconnect
    socket.on('disconnect', async () => {
        const res = await pubClient.srem(currentPlayers, playerValueString(socket));
        logger.debug(`number of players removed in disconnect handler: ${res}`);
    })

    /**
     * MESSAGE HELPERS
     */
    // send to connected clients excluding sender
    const sendToOthers = (type: string, payload?: unknown) => {
        socket.to(`${socket.gameId}`).emit(type, payload)

        logOutgoing(type, payload, "others", source);
    }

    // send to connected clients including sender
    const sendToAll = (type: string, payload?: unknown) => {
        io.to(`${socket.gameId}`).emit(type, payload);
        logOutgoing(type, payload, "all", source);
    }

    /*******************************************************************
     * EVENT LISTENERS
     *******************************************************************/

    /**
    * PLAYER JOIN
    */
    socket.on(types.PLAYER_JOINED_GAME, (msg: payloads.PlayerEvent) => {
        sendToOthers(types.PLAYER_JOINED_GAME, msg)
    })


    /**
    * ANSWER PART 1
    */
    socket.on(types.ANSWER_PART_1, async (msg: payloads.AnswerPart1, cb) => {
        logIncoming(types.ANSWER_PART_1, msg, source);

        try {
            await submitAnswerPart1(socket, msg);
            cb('ok')
        } catch (e) {
            logError('[answerPart1] error submiting answer.', e);
            cb('error submitting anser');
        }
    })

    /**
     * ANSWER PART 2
     */
    socket.on(types.ANSWER_PART_2, async (msg: payloads.AnswerPart2, cb) => {
        logIncoming(types.ANSWER_PART_2, msg, source)
        const { playerKey } = socket.keys;

        try {
            const pendingList = await submitAnswerPart2(socket, msg) // returns list of players that havent answered yet

            // store player guess
            await pubClient.set(`${playerKey}:${msg.gameQuestionId}:guess`, `${msg.guess}`, 'EX', ONE_DAY);

            // send list to all clients
            sendToAll(types.SET_HAVE_NOT_ANSWERED, pendingList)

            if (!pendingList.length) {
                const current = await pubClient.get(currentSequenceIndex)
                const total = await pubClient.get(totalQuestions)

                // if last question, move to game results
                if (current === total) {

                    // calculate scores
                    const result = await saveScores(msg.gameQuestionId, socket.gameId);

                    // end game
                    sendToAll(types.GAME_END, result as payloads.QuestionEnd)
                } else {

                    // calculate scores
                    const result = await saveScores(msg.gameQuestionId, socket.gameId);

                    // send result
                    sendToAll(types.QUESTION_END, result as payloads.QuestionEnd)
                }
            }

            cb('ok')
        } catch (e) {
            logError('[submitAnswerPart2] Error', e)
            cb('error')
        }
    })

    /*******************************************************************
     * HOST ONLY LISTENERS
     ********************************************************************/

    if (socket.isHost) {

        /**
         * START GAME
         */
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

        /**
         * END GAME
         */
        socket.on(types.END_GAME, async (ack) => {
            logIncoming(types.END_GAME, {}, source);

            try {
                // calculate results
                const result = await endGame(socket);

                if (result) {
                    // send results
                    sendToOthers(types.GAME_END_NO_ANNOUNCE, result as payloads.QuestionEnd)

                    // acknowledge complete
                    ack('ok')
                }

                ack('game not in progress')
            } catch (e) {
                logError('Error while ending game', e);
                await pubClient.set(gameStatus, 'inProgress'); // reset so request can be sent again
                ack('error')
            }
        })

        /**
        * REMOVE PLAYER
        */
        socket.on(types.REMOVE_PLAYER, async (msg: payloads.PlayerEvent) => {
            logIncoming(types.REMOVE_PLAYER, msg, source)

            // add player to removed players set
            const remResponse = await pubClient.sadd(removedPlayers, msg.id);
            await pubClient.expire(removedPlayers, ONE_DAY);

            logger.debug(`Player added to removed list: ${remResponse}`)

            // remove player from current players
            await pubClient.srem(currentPlayers, JSON.stringify(msg)); // remove from redis
            sendToAll(types.REMOVE_PLAYER, msg);
        })

        /**
        * SKIP QUESTION
        */
        socket.on(types.SKIP_QUESTION, async (msg: payloads.QuestionSkip, ack) => {
            logIncoming(types.SKIP_QUESTION, msg, source)

            try {
                const nextQuestionResult = await nextQuestion(socket)
                sendToAll(types.SET_QUESTION_STATE, {
                    ...nextQuestionResult,
                    status: 'question'
                } as payloads.SetQuestionState)

                ack('ok')
            } catch (e) {
                logError('Error while skipping question', e)
                ack('error')
            }
        })

        /**
        * MOVE TO SCORES FROM ANSWERS
        */
        socket.on(types.MOVE_TO_QUESTION_RESULTS, () => {
            sendToAll(types.MOVE_TO_QUESTION_RESULTS)
        });

        /**
        * READER TAKEOVER
        */
        socket.on(types.HOST_TAKE_OVER_READING, (msg: payloads.PlayerEvent) => {
            logIncoming(types.HOST_TAKE_OVER_READING, msg, source)
            sendToAll(types.SET_READER, msg)
        })

        /**
         * END QUESTION AND MOVE TO ANSWERS
         */
        socket.on(types.MOVE_TO_ANSWER, async (msg: payloads.QuestionSkip, ack) => {
            logIncoming(types.MOVE_TO_ANSWER, msg, source)

            try {

                // calculate scores
                const result = await saveScores(msg.gameQuestionId, socket.gameId);

                // send result
                sendToAll(types.QUESTION_END, result as payloads.QuestionEnd);
                ack('ok')
            } catch (e) {
                logError('Error skipping to results', e)
                ack('error')
            }
        });

        /**
        * NEXT QUESTION
        */
        socket.on(types.START_NEXT_QUESTION, async (_, ack) => {
            logIncoming(types.START_NEXT_QUESTION, {}, source)

            try {
                const nextQuestionResult = await nextQuestion(socket)
                sendToAll(types.SET_QUESTION_STATE, {
                    ...nextQuestionResult,
                    status: 'question'
                } as payloads.SetQuestionState)

                ack('ok')
            } catch (e) {
                logError('Error while starting question', e)
                ack('error')
            }
        })

    }
}

export default registerListeners;