import { logger } from "@whosaidtrue/logger";
import { types } from '@whosaidtrue/api-interfaces';
import { Socket } from "socket.io";
import { games } from "../db";
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";

/**
 * Check if game data is in redis, if not
 * fetch from DB and insert at key.
 */
const initializeGame = async (socket: Socket) => {

    const status = socket.keys.gameStatus;

    const lock = await pubClient.set(status, 1, 'EX', 10, 'NX');

    // if game data already exists, or another socket is already fetching it, exit
    if (!lock) return;

    try {
        const { rows } = await games.getById(socket.gameId);

        // if no result, send error and return
        if (!rows.length) {
            await pubClient.del(status); // release lock
            socket.emit(types.GAME_NOT_FOUND);
            return;
        }

        const game = rows[0]

        // set total questions value
        await pubClient.set(socket.keys.totalQuestions, game.total_questions, 'EX', ONE_DAY)

        // set status key to match game
        await pubClient.set(status, game.status, 'EX', ONE_DAY);
        logger.debug(`Game initialized. Status: ${game.status}`)
    } catch (e) {
        logger.error('error while retrieving game data', e)
        await pubClient.del(status); // release lock
    }
}

export default initializeGame;