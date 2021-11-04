import { Socket } from 'socket.io';
import { payloads } from "@whosaidtrue/api-interfaces";
import { answers } from '../db';
import { Keys } from '../keys';
import { pubClient } from '../redis';
import { playerValueString } from '../util';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { ONE_DAY } from '../constants';

/**
 * Add a guess value to specified game_answer row.
 *
 * Returns the new list of players that haven't answered yet
 */
const submitAnswerPart2 = async (socket: Socket, msg: payloads.AnswerPart2): Promise<PlayerRef[]> => {
    const { answerIds } = socket.keys;
    const idKey = `${answerIds}:${msg.gameQuestionId}`;
    const haveAnswered = Keys.haveAnswered(msg.gameQuestionId);
    const haveNotAnswered = Keys.haveNotAnswered(msg.gameQuestionId);

    // get answer id from redis
    const Id = await pubClient.get(idKey);

    // submit guess
    const { rows } = await answers.submitGuess(Number(Id), msg.guess)

    // make sure guess was added to game_answer row
    if (!rows[0].id) throw new Error(`Could not update answer with id: ${Id}`)

    // add player and answer to list of players that have answered
    const [, , r3] = await pubClient
        .pipeline()
        .sadd(haveAnswered, playerValueString(socket, msg.guess))
        .srem(haveNotAnswered, playerValueString(socket))
        .smembers(haveNotAnswered)
        .expire(haveAnswered, ONE_DAY)
        .expire(haveNotAnswered, ONE_DAY)
        .exec()

    return r3[1].map(s => JSON.parse(s))

}

export default submitAnswerPart2;