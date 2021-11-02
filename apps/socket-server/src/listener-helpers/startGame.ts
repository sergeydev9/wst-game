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
    const notAnsweredKey = Keys.haveNotAnswered(question.gameQuestionId);

    // update game status
    const [, , , , , notAnsweredStrings] = await pubClient
        .pipeline()
        .set(gameStatus, game.status, 'EX', ONE_DAY)
        .set(Keys.totalPlayers(question.gameQuestionId), currentCount, 'EX', ONE_DAY)
        .set(`gameQuestions:${question.gameQuestionId}:globalTrue`, question.globalTrue, 'EX', ONE_DAY)
        .sunionstore(notAnsweredKey, currentPlayers)
        .expire(notAnsweredKey, ONE_DAY)
        .smembers(notAnsweredKey)
        .exec()

    const notAnsweredParsed = notAnsweredStrings[1].map(s => JSON.parse(s));

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