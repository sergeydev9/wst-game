import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { Keys } from '../keys';
import { pubClient } from "../redis";
import { payloads } from "@whosaidtrue/api-interfaces";
import endQuestion from './endQuestion';
import { NextQuestionResult } from "@whosaidtrue/app-interfaces";
import setNewReader from './setNewReader';

/**
 * Performs the necessary game state updates when a player leaves the game,
 * either as the result of being removed, or as the result of intentionally leaving
 */
async function playerLeft(socket: Socket, player: payloads.PlayerEvent) {

    const {
        currentPlayers,
        readerList,
        currentQuestion,
        totalQuestions
    } = socket.keys;

    // get  current question data
    const questionString = await pubClient.get(currentQuestion);
    const question: NextQuestionResult = JSON.parse(questionString);

    const haveNotAnswered = Keys.haveNotAnswered(question.gameQuestionId);
    const playerString = JSON.stringify(player);

    // remove player from current players, and count the number of players that haven't answered
    const [, , , count, totalQuestionNum] = await pubClient
        .pipeline()
        .srem(currentPlayers, playerString)
        .srem(readerList, playerString)
        .srem(haveNotAnswered, playerString)
        .scard(haveNotAnswered)
        .get(totalQuestions)
        .exec()

    logger.debug({
        message: '[Player Left] have not answered count',
        count: count[1],
        playerString,
        totalQuestionNum
    })

    // if player was the reader, set a new reader
    if (player.id === Number(question.readerId)) {
        await setNewReader(socket, question);
    }

    // if player was last that had not answered
    if (count[1] == 0) {
        await endQuestion(socket, question.gameQuestionId, question.sequenceIndex, Number(totalQuestionNum[1]));
    }
}

export default playerLeft;