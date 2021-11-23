import { Socket } from "socket.io";
import { pubClient } from "../redis";
import { logger } from '@whosaidtrue/logger';
import { types, payloads } from '@whosaidtrue/api-interfaces';
import saveScores from "./saveScores";
import { games } from '../db';
import { ONE_DAY } from "../constants";
import sendFunFacts from "./sendFunFacts";

/**
 * Calculate the results and end the game
 */
const endGame = async (socket: Socket) => {
    const { gameStatus, currentQuestionId, latestResults } = socket.keys;

    logger.debug({
        message: '[END GAME]'
    })

    // use game status as a sort of lock to deduplicate requests
    const status = await pubClient.get(gameStatus);

    // if status is finished
    if (status === 'finished') return;

    const [, questionIdResult] = await pubClient
        .pipeline()
        .set(gameStatus, 'calculatingScores')
        .get(currentQuestionId)
        .exec()

    const questionId = questionIdResult[1];
    const result = await saveScores(questionId, socket.gameId);

    // end game in DB
    await games.endGame(socket.gameId);

    // save results in redis
    await pubClient
        .pipeline()
        .set(latestResults, JSON.stringify(result), 'EX', ONE_DAY)
        .set(gameStatus, 'postGame', 'EX', ONE_DAY)
        .exec()

    // send fun facts
    await sendFunFacts(socket);

    // end game
    socket.sendToAll(types.GAME_END, result as payloads.QuestionEnd);

    return result;
}

export default endGame;