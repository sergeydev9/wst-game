import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { games } from '../db';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { PlayerRef } from "@whosaidtrue/app-interfaces";

const startGame = async (socket: Socket) => {

    const { gameId } = socket
    const {
        currentPlayers,
        readerList,
        currentQuestion,
        currentSequenceIndex
    } = socket.keys;

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

    // set have not answered list from players list
    const notAnsweredKey = `${question.gameQuestionId}:haveNotAnswered`;
    await pubClient.send_command('COPY', currentPlayers, notAnsweredKey)
    await pubClient.expire(notAnsweredKey, ONE_DAY)

    // get and parse set of players that have not answered
    const notAnsweredStrings = await pubClient.smembers(notAnsweredKey)
    const notAnsweredParsed = notAnsweredStrings.map(s => JSON.parse(s))

    logger.debug(`Game start result: ${JSON.stringify(gameStartResult)}`)

    // save question in redis
    await pubClient.send_command('JSON.SET', currentQuestion, '.', JSON.stringify(question))

    // set current sequence index in Redis
    await pubClient.set(currentSequenceIndex, 1, 'EX', ONE_DAY)

    return {
        ...gameStartResult,
        currentCount,
        haveNotAnswered: notAnsweredParsed
    };
}

export default startGame;