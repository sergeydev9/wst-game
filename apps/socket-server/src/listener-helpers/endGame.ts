import { Socket } from "socket.io";
import { pubClient } from "../redis";
import saveScores from "./saveScores";
import { games } from '../db';
import { ONE_DAY } from "../constants";

/**
 * Calculate the results and end the game
 */
const endGame = async (socket: Socket) => {
    const { gameStatus, currentQuestion, latestResults } = socket.keys;

    // use game status as a sort of lock to deduplicate requests
    const status = await pubClient.get(gameStatus);

    // if status is finished
    if (status === 'finished') return;

    const [, questionIdResult] = await pubClient
        .pipeline()
        .set(gameStatus, 'calculatingScores')
        .get(`${currentQuestion}:id`)
        .exec()

    const currentQuestionId = questionIdResult[1];
    const result = await saveScores(currentQuestionId, socket.gameId);

    // end game in DB
    await games.endGame(socket.gameId);

    // save ressults in redis
    await pubClient.set(latestResults, JSON.stringify(result), 'EX', ONE_DAY)

    return result;
}

export default endGame;