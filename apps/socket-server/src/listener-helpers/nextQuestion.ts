import { Socket } from "socket.io";
import { PlayerRef } from "@whosaidtrue/app-interfaces";
import { pubClient } from "../redis";
import { gameQuestions } from "../db";
import { Keys } from '../keys';
import { ONE_DAY } from "../constants";
import { logger } from "@whosaidtrue/logger";

const nextQuestion = async (socket: Socket) => {

    const { gameId } = socket
    const {
        currentPlayers,
        readerList,
        currentQuestion,
        currentSequenceIndex,
        currentQuestionId
    } = socket.keys;

    // pop a reader from the list and count current players
    const [readerRes, playerRes, nextIndexRes] = await pubClient
        .pipeline()
        .spop(readerList)
        .scard(currentPlayers)
        .incr(currentSequenceIndex)
        .exec();

    let readerString = readerRes[1];
    logger.debug(readerString)
    // if no readers left in list
    if (!readerString) {

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

    const reader = JSON.parse(readerString) as PlayerRef;
    const currentCount = playerRes[1];
    const nextIndex = nextIndexRes[1];

    // get question from db
    const questionResult = await gameQuestions.getNext(
        gameId,
        nextIndex,
        reader.player_name,
        reader.id,
        currentCount
    );

    // copy current players set into list of players that have not answered
    const notAnsweredKey = Keys.haveNotAnswered(questionResult.gameQuestionId);
    await pubClient.sunionstore(notAnsweredKey, currentPlayers)
    const notAnsweredStrings = await pubClient.smembers(notAnsweredKey)
    const haveNotAnswered = notAnsweredStrings.map(s => JSON.parse(s))


    await pubClient
        .pipeline()
        .set(currentQuestion, JSON.stringify(questionResult), 'EX', ONE_DAY)
        .set(Keys.totalPlayers(questionResult.gameQuestionId), currentCount)
        .set(currentQuestionId, questionResult.gameQuestionId, 'EX', ONE_DAY)
        .exec()

    return {
        ...questionResult,
        numPlayers: currentCount,
        haveNotAnswered
    }

}

export default nextQuestion;