import { NextQuestionResult } from '@whosaidtrue/app-interfaces';
import { logError } from '@whosaidtrue/logger';
import { Pool } from 'pg';
import Dao from '../base.dao';
import { getQuestionData } from '../questions/Questions.dao';



// get a new question and set its question sequence index value and reader id/name
export function getAndUpdateQuery(gameId: number, readerId: number, readerName: string, numPlayers: number, sequenceIndex = 1) {

    const gameQuestionUpdate = `
        UPDATE game_questions
        SET
            reader_id = $1,
            reader_name = $2,
            question_sequence_index = $5,
            player_number_snapshot = $3
        WHERE id = (
            SELECT id
            FROM game_questions
            WHERE game_id = $4
            AND question_sequence_index IS NULL
            LIMIT 1
            )
        RETURNING id, reader_id, reader_name, question_sequence_index, player_number_snapshot, question_id;
        `
    return {
        text: gameQuestionUpdate,
        name: 'next_question',
        values: [readerId, readerName, numPlayers, gameId, sequenceIndex]
    }
}

class GameQuestions extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_questions')
    }

    public async getNext(gameId: number, nextIndex: number, readerName: string, readerId: number, numPlayers: number): Promise<NextQuestionResult> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            // get game question
            const gameQuestionResult = await client.query(getAndUpdateQuery(gameId, readerId, readerName, numPlayers, nextIndex));
            const gameQuestion = gameQuestionResult.rows[0]

            // if no game question, throw
            if (!gameQuestion) throw new Error('Could not fetch next question');

            // get global true, and text for question
            const { question_id } = gameQuestionResult.rows[0];
            const questionResult = await client.query(getQuestionData(question_id));
            const questionRow = questionResult.rows[0];

            if (!questionRow) throw new Error('Error fetching question data')

            await client.query('COMMIT');
            return {
                questionId: questionRow.id,
                gameQuestionId: gameQuestion.id,
                numPlayers: gameQuestion.player_number_snapshot,
                sequenceIndex: gameQuestion.question_sequence_index,
                readerId: gameQuestion.reader_id,
                readerName: gameQuestion.reader_name,
                text: questionRow.text,
                textForGuess: questionRow.text_for_guess,
                followUp: questionRow.follow_up,
                category: questionRow.category,
                globalTrue: Math.round(questionRow.global_true) || 0

            }

        } catch (e) {
            logError('Error while fetching next question', e);
            await client.query('ROLLBACK')

        } finally {
            client.release()
        }

    }
}

export default GameQuestions