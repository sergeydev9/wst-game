import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { games } from '../db';
import { Keys } from '../keys';
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { PlayerRef } from "@whosaidtrue/app-interfaces";

const startGame = async (socket: Socket) => {

    const { gameId } = socket
    const {
        currentPlayers,
        readerList,
        currentQuestion,
        currentQuestionId,
        currentSequenceIndex,
        gameStatus
    } = socket.keys;

    // DEV_NOTE: can't pipeline these because send_command doesn't work on pipeline
    // in ioredis :(

    // count currently connected players
    const currentCount = await pubClient.scard(currentPlayers);

    // set readers list from players list
    await pubClient.sunionstore(readerList, currentPlayers);
    await pubClient.expire(readerList, ONE_DAY);

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
    await pubClient.set(gameStatus, game.status);

    // set player count
    await pubClient.set(Keys.totalPlayers(question.gameQuestionId), currentCount, 'EX', ONE_DAY);

    // set have not answered list from players list
    const notAnsweredKey = Keys.haveNotAnswered(question.gameQuestionId);
    await pubClient.sunionstore(notAnsweredKey, currentPlayers);
    await pubClient.expire(notAnsweredKey, ONE_DAY);

    // get and parse set of players that have not answered
    const notAnsweredStrings = await pubClient.smembers(notAnsweredKey);
    const notAnsweredParsed = notAnsweredStrings.map(s => JSON.parse(s));

    logger.debug({ message: 'Game start result', gameStartResult });

    // save question in redis
    await pubClient
        .pipeline()
        .set(currentQuestion, JSON.stringify(question), 'EX', ONE_DAY)
        .set(currentQuestionId, question.gameQuestionId, 'EX', ONE_DAY)
        .set(currentSequenceIndex, 1, 'EX', ONE_DAY)
        .exec()

    return {
        ...gameStartResult,
        currentCount,
        haveNotAnswered: notAnsweredParsed
    };
};

export default startGame;