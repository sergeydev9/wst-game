import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { Keys } from '../keys';
import { pubClient } from "../redis";
import { payloads, types } from "@whosaidtrue/api-interfaces";
import saveScores from "./saveScores";
import endGame from './endGame';


/**
 * Performs the necessary game state updates when a player leaves the game,
 * either as the result of being removed, or as the result of intentionally leaving
 */
async function playerLeft(socket: Socket, player: payloads.PlayerEvent) {

    const {
        currentPlayers,
        readerList,
        currentQuestionId,
        currentSequenceIndex,
        totalQuestions,
        bucketList,
        groupVworld
    } = socket.keys;

    // get id of current question
    const questionId = await pubClient.get(currentQuestionId)

    const haveNotAnswered = Keys.haveNotAnswered(Number(questionId));

    const playerString = JSON.stringify(player);

    // remove player from current players, and count the number of players that haven't answered
    const [, , , count, sequenceIndex, totalQuestionNum, totalPlayers] = await pubClient
        .pipeline()
        .srem(currentPlayers, playerString)
        .srem(readerList, playerString)
        .srem(haveNotAnswered, playerString)
        .scard(haveNotAnswered)
        .get(currentSequenceIndex)
        .get(totalQuestions)
        .scard(currentPlayers)
        .exec()


    logger.debug({
        message: '[Player Left] have not answered count',
        count,
        playerString
    })

    // if player was last
    if (count[1] == 0) {

        // after 4th question, start sending facts.
        // They don't always show, but might as well send them anyways
        if (sequenceIndex[1] && Number(sequenceIndex[1]) > 4) {
            const [bucketListResponse, groupVworldResponse] = await pubClient
                .pipeline()
                .hgetall(groupVworld)
                .hgetall(bucketList)
                .exec()

            socket.sendToAll(types.FUN_FACTS,
                {
                    bucketList: bucketListResponse[1],
                    groupVworld: groupVworldResponse[1]
                })
        }

        // if this is the last question, or that was the last player, end the game
        if ((sequenceIndex[1] === totalQuestionNum[1]) || Number(totalPlayers[1]) < 2) {
            await endGame(socket)
        } else {
            // calculate scores
            const result = await saveScores(Number(questionId), socket.gameId);

            logger.debug({
                message: '[Save Scores]',
                ...result
            })

            // send result
            socket.sendToAll(types.QUESTION_END, result);
        }

    }
}

export default playerLeft;