import { Socket } from 'socket.io';
import { payloads } from "@whosaidtrue/api-interfaces";
import { answers } from '../db';
import { Keys } from '../keys';
import { pubClient } from '../redis';
import { ONE_DAY } from '../constants';

const submitAnswerPart1 = async (socket: Socket, msg: payloads.AnswerPart1) => {
    const { hasPassed, answerIds } = socket.keys;

    const idKey = `${answerIds}:${msg.gameQuestionId}`

    // prevent passing more than once per game
    if (msg.answer === 'pass') {

        if (await pubClient.get(`${hasPassed}`)) {
            throw new Error('Already passed')
        }

        // mark player as having passed
        await pubClient.set(`${hasPassed}`, 1, 'EX', ONE_DAY)
    } else if (msg.answer === 'true') {

        // increment count for current question. Sets to 1 if no value
        await pubClient.incr(Keys.totalTrue(msg.gameQuestionId))
    }

    // submit answer
    const { rows } = await answers.submitValue(
        socket.playerId,
        msg.gameQuestionId,
        socket.gameId,
        msg.answer,
    )

    // set answer id in redis for re-use in part 2
    await pubClient.set(idKey, rows[0].id, 'EX', ONE_DAY)
}

export default submitAnswerPart1;