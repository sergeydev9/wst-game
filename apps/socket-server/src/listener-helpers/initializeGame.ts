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

    const lock = await pubClient.get(status);

    // if game data already exists, or another socket is already fetching it, exit
    if (lock) return;

    // setting value acts as a lock so that only 1 connection
    // attempts to fetch data
    await pubClient.set(status, 1, 'EX', 10);

    try {
        const { rows } = await games.getById(socket.gameId);

        // if no result, send error and return
        if (!rows.length) {
            await pubClient.del(status); // release lock
            socket.emit(types.GAME_NOT_FOUND);
            return;
        }

        // set status key to match game
        await pubClient.set(status, rows[0].status, 'EX', ONE_DAY);
        logger.debug(`Game initialized. Status: ${rows[0].status}`)
    } catch (e) {
        logger.error('error while retrieving game data', e)
        await pubClient.del(status); // release lock
    }
}

export default initializeGame;