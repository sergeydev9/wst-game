import { Socket } from "socket.io";
import { NextQuestionResult, PlayerRef } from "@whosaidtrue/app-interfaces";
import { types } from '@whosaidtrue/api-interfaces';
import { pubClient } from "../redis";
import { gameQuestions } from "../db";
import { ONE_DAY } from "../constants";
import { logger } from "@whosaidtrue/logger";


/**
 * Set a new reader for an ongoing question.
 *
 * This function is called when a player that was the reader
 * leaves or was removed from the game.
 */
const setNewReader = async (socket: Socket, question: NextQuestionResult) => {

    const {
        currentPlayers,
        currentQuestion,
        readerList,
    } = socket.keys;

    // pop a reader from the list and count current players
    const readerRes = await pubClient.spop(readerList)

    let readerString = readerRes
    logger.debug(readerString);

    // if no readers left in list
    if (!readerString) {

        // make a new reader list, using the list of current players
        const [, , readerResult] = await pubClient
            .pipeline()
            .sunionstore(readerList, currentPlayers)
            .expire(readerList, ONE_DAY)
            .spop(readerList)
            .exec()

        // pop a reader from the list to assign them as the reader
        readerString = readerResult[1];
    } else {

        // check if reader is still connected
        const isMem = await pubClient.sismember(currentPlayers, readerString)

        // if next reader no longer connected
        if (!isMem) {

            // count size of readers list
            const readerCard = await pubClient.scard(readerList);

            // if no readers left, copy
            if (!readerCard) {
                const [, , readerResult] = await pubClient
                    .pipeline()
                    .sunionstore(readerList, currentPlayers)
                    .expire(readerList, ONE_DAY)
                    .spop(readerList)
                    .exec()

                // pop a reader from the list to assign them as the reader
                readerString = readerResult[1];
            }
        }
    }

    // update current reader in Redis
    const reader = JSON.parse(readerString) as PlayerRef;
    const newQuestionData = { ...question, readerId: reader.id, reader_name: reader.player_name };
    await pubClient.set(currentQuestion, JSON.stringify(newQuestionData), 'EX', ONE_DAY);

    // update current reader in DB
    try {
        await gameQuestions.setNewReader(question.questionId, reader.id, reader.player_name)
    } catch (e) {
        // if an error happens here, just log it and keep playing, no need to throw
        logger.error({
            message: '[Set New Reader] An error occurred while attempting to update the reader in the DB.',
            error: e
        })
    }

    socket.sendToAll(types.SET_READER, reader)
}

export default setNewReader;