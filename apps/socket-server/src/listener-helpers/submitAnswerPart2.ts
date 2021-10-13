import { Socket } from 'socket.io';
import { payloads } from "@whosaidtrue/api-interfaces";
import { answers } from '../db';
import { pubClient } from '../redis';
import { playerValueString } from '../util';
import { PlayerRef } from '@whosaidtrue/app-interfaces';

/**
 * Add a guess value to specified game_answer row.
 *
 * Returns the new list of players that haven't answered yet
 */
const submitAnswerPart2 = async (socket: Socket, msg: payloads.AnswerPart2): Promise<PlayerRef[]> => {
    const { answerIds } = socket.keys;
    const NaKey = `${msg.gameQuestionId}:haveNotAnswered`;
    const idKey = `${answerIds}:${msg.gameQuestionId}`;

    // get answer id from redis
    const Id = await pubClient.get(idKey);

    // submit guess
    const { rows } = await answers.submitGuess(Number(Id), msg.guess)

    // make sure guess was added to game_answer row
    if (!rows[0].id) throw new Error(`Could not update answer with id: ${Id}`)

    // remove player from list of awaiting
    await pubClient.srem(NaKey, playerValueString(socket));
    const sList = await pubClient.smembers(NaKey);

    return sList.map(s => JSON.parse(s))

}

export default submitAnswerPart2;