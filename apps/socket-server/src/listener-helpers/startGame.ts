import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { games } from '../db';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { PlayerRef } from "@whosaidtrue/app-interfaces";

const startGame = async (socket: Socket) => {

    const { gameId } = socket
    const { currentPlayers, readerList, currentQuestion } = socket.keys;

    // count currently connected players
    const currentCount = await pubClient.scard(currentPlayers);

    // set readers list from players list
    await pubClient.send_command('COPY', currentPlayers, readerList)
    await pubClient.expire(readerList, ONE_DAY)

    // pop a reader from the list to assign them as the first reader
    const readerString = await pubClient.spop(readerList);
    const reader = JSON.parse(readerString) as PlayerRef;

    // set start time
    const startDate = new Date();

    // update game and question, fetch question text
    const gameStartResult = await games.start(
        gameId,
        currentCount,
        reader.id,
        reader.player_name,
        startDate
    )
    const { game, question } = gameStartResult;

    // update game status
    await pubClient.set(socket.keys.gameStatus, game.status);

    // use list of current players as list of players that haven't answered yet
    const notAnsweredStrings = await pubClient.smembers(currentPlayers);
    const haveNotAnswered = notAnsweredStrings.map(s => JSON.parse(s)) as PlayerRef[];

    logger.debug(`Have not answered: ${JSON.stringify(haveNotAnswered)}`)
    logger.debug(`Game start result: ${JSON.stringify(gameStartResult)}`)

    // save question in redis
    await pubClient.send_command(
        'JSON.SET',
        currentQuestion,
        '.',
        JSON.stringify(
            {
                ...question,
                haveNotAnswered,
                numHaveNotGuessed: currentCount,
            }))


    return {
        ...gameStartResult,
        currentCount,
        haveNotAnswered
    };
}

export default startGame;