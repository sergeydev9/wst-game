import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { Keys } from '../keys';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { payloads, types } from "@whosaidtrue/api-interfaces";
import saveScores from "./saveScores";


/**
 * Remove a player from the game and notify all others.
 */
async function removePlayer(socket: Socket, player: payloads.PlayerEvent) {

    const {
        currentPlayers,
        removedPlayers,
        readerList,
        currentQuestionId,
        currentSequenceIndex,
        totalQuestions,
        bucketList,
        groupVworld
    } = socket.keys;

    // add player to removed players set
    const remResponse = await pubClient.sadd(removedPlayers, player.id);
    await pubClient.expire(removedPlayers, ONE_DAY);

    logger.debug(`Player added to removed list: ${remResponse}`)

    // get id of current question
    const questionId = await pubClient.get(currentQuestionId)

    const haveNotAnswered = Keys.haveNotAnswered(Number(questionId));

    const playerString = JSON.stringify(player);

    // remove player from current players, and count the number of players that haven't answered
    const [, , , count, sequenceIndex, totalQuestionNum] = await pubClient
        .pipeline()
        .srem(currentPlayers, playerString)
        .srem(readerList, playerString)
        .srem(haveNotAnswered, playerString)
        .scard(haveNotAnswered)
        .get(currentSequenceIndex)
        .get(totalQuestions)
        .exec()

    socket.sendToAll(types.REMOVE_PLAYER, player);

    logger.debug({
        message: '[Remove Player] have not answered count',
        count,
        haveNotAnswered,
        playerString
    })

    // if player was last
    if (count[1] == 0) {

        // after 4th question, start sending facts
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

        // if this is the last question, end the game
        if (sequenceIndex[1] === totalQuestionNum[1]) {

            // calculate scores
            const result = await saveScores(Number(questionId), socket.gameId);

            logger.debug({
                message: 'Score calculation results',
                event: types.ANSWER_PART_2,
                ...result
            })

            // end game
            socket.sendToAll(types.GAME_END, result as payloads.QuestionEnd);
        } else {
            // calculate scores
            const result = await saveScores(Number(questionId), socket.gameId);

            logger.debug({
                message: '[Remove Player] Score calculation results',
                ...result
            })

            // send result
            socket.sendToAll(types.QUESTION_END, result);
        }

    }
}

export default removePlayer;