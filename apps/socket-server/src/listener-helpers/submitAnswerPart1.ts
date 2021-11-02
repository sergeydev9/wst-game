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

    // each question has a set for each possible value. Add player to the set for the answer they submit
    switch (msg.answer) {
        case 'pass':
            await pubClient
                .pipeline()
                .sadd(`gameQuestions:${msg.gameQuestionId}:pass`, socket.playerName)
                .expire(`gameQuestions:${msg.gameQuestionId}:pass`, ONE_DAY)
                .exec()
            break;

        case 'true':
            await pubClient
                .pipeline()
                .sadd(`gameQuestions:${msg.gameQuestionId}:true`, socket.playerName)
                .expire(`gameQuestions:${msg.gameQuestionId}:true`, ONE_DAY)
                .exec()
            break;

        case 'false':
            await pubClient
                .pipeline()
                .sadd(`gameQuestions:${msg.gameQuestionId}:false`, socket.playerName)
                .expire(`gameQuestions:${msg.gameQuestionId}:false`, ONE_DAY)
                .exec()
            break;

    }
}

export default submitAnswerPart1;