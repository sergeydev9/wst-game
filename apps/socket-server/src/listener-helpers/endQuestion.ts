import { Socket } from "socket.io";
import { logger } from '@whosaidtrue/logger';
import { payloads, types } from "@whosaidtrue/api-interfaces";
import saveScores from "./saveScores";
import sendFunFacts from "./sendFunFacts";


/**
 * Common set of steps that need to happen at the end of every question.
 *
 * This function gets called either when the last player that hasn't answered is removed,
 * when the last guess is submitted, or the host presses 'Skip to Results.
 *
 * This function is responsible for checking if the question was the last in the game
 * and responding accordingly.
 *
 * @param socket
 * @param questionId: id of the current question
 * @param currentSequenceIndex sequence index of the question that is ending
 * @param totalQuestions total questions for the game. Should always be 9, but if that's ever changed, not a whole lot of work needs to be done.
 */
async function endQuestion(socket: Socket, questionId: number, currentSequenceIndex: number, totalQuestions: number) {

    // if this is the last question, end the game
    if (currentSequenceIndex === totalQuestions) {

        // calculate scores
        const result = await saveScores(Number(questionId), socket.gameId);

        logger.debug({ message: '[End Game] Score calculation results', ...result })

        // end game
        socket.sendToAll(types.GAME_END, result as payloads.QuestionEnd);
    } else {
        // calculate scores
        const result = await saveScores(Number(questionId), socket.gameId);

        logger.debug({ message: '[End Question] Score calculation results', ...result })

        // send result
        socket.sendToAll(types.QUESTION_END, result);
    }

    // after 4th question, start sending facts.
    // The front end can decide which fact to show and when.
    if (currentSequenceIndex > 4) {
        await sendFunFacts(socket);
    }

}

export default endQuestion;