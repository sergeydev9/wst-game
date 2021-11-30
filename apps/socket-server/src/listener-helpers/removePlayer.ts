import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { Keys } from '../keys';
import { gamePlayers } from "../db";
import { pubClient } from "../redis";
import { ONE_DAY } from "../constants";
import { payloads, types } from "@whosaidtrue/api-interfaces";
import endQuestion from './endQuestion';
import setNewReader from "./setNewReader";
import { NextQuestionResult } from "@whosaidtrue/app-interfaces";

/**
 * Remove a player from the game and notify all others.
 */
async function removePlayer(socket: Socket, player: payloads.PlayerEvent) {

    const {
        currentPlayers,
        removedPlayers,
        readerList,
        currentQuestion,
        totalQuestions,
    } = socket.keys;

    logger.debug({
        message: '[removePlayer]',
        player
    });

    const playerString = JSON.stringify({ id: player.id, player_name: player.player_name });

    // add player to removed players set
    const remResponse = await pubClient.sadd(removedPlayers, player.id);
    await pubClient.expire(removedPlayers, ONE_DAY);

    logger.debug({
        message: '[removePlayer] Players added to removed players key',
        numPlayers: remResponse
    })

    // if player is removed from the lobby,
    // you only need to change their status in the DB and remove them from the current players key.
    // Otherwise, other data for the current question needs to be updated.
    if (player.event_origin === 'lobby') {
        await gamePlayers.setStatus(player.id, 'removed_lobby');
        await pubClient.srem(currentPlayers, playerString);
        socket.sendToAll(types.REMOVE_PLAYER, player);
        return;
    } else {
        await gamePlayers.setStatus(player.id, 'removed_game')
    }

    // get current question data
    const questionString = await pubClient.get(currentQuestion);
    const question: NextQuestionResult = JSON.parse(questionString);
    const haveNotAnswered = Keys.haveNotAnswered(Number(question.gameQuestionId));

    // remove player from current players, and count the number of players that haven't answered
    const [, , , count, totalQuestionNum] = await pubClient
        .pipeline()
        .srem(currentPlayers, playerString)
        .srem(readerList, playerString)
        .srem(haveNotAnswered, playerString)
        .scard(haveNotAnswered)
        .get(totalQuestions)
        .exec()

    socket.sendToAll(types.REMOVE_PLAYER, player);

    logger.debug({
        message: '[removePlayer] have not answered count',
        count,
        haveNotAnswered,
        playerString
    })

    // if player was the reader, set a new reader
    if (player.id === question.readerId) {
        await setNewReader(socket, question);
    }
    // if player was last that had not answered, end the question
    if (count[1] == 0) {
        await endQuestion(
            socket,
            question.gameQuestionId,
            Number(question.sequenceIndex),
            Number(totalQuestionNum[1]
            ));
    }
}

export default removePlayer;