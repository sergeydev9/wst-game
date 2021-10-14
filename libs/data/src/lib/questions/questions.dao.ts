import { InsertQuestion } from '@whosaidtrue/app-interfaces';
import { Pool } from 'pg';
import Dao from '../base.dao';

export function getQuestionData(questionId: number) {
    // get question text and true percent stats
    const getQuestionQuery = `
        WITH question AS (
            SELECT * FROM questions WHERE id = $1
        ),
        q_answers AS (
            SELECT value FROM game_answers
            LEFT JOIN game_questions
            ON game_answers.game_question_id = game_questions.id
            WHERE game_questions.question_id = $1
        ), q_true AS (
            SELECT count(value) FROM q_answers
            WHERE q_answers.value = 'true'
        ), q_total AS (
            SELECT count(value) FROM q_answers
        ), gt AS (
            SELECT ((SELECT count FROM q_true)::numeric / (SELECT NULLIF(count, 0) from q_total)::numeric)::float * 100 as global_true
        )
        SELECT * FROM question
        LEFT JOIN gt
        ON true;`;

    return {
        text: getQuestionQuery,
        name: 'question_text_and_stats',
        values: [questionId]
    }

}

class Question extends Dao {
    constructor(pool: Pool) {
        super(pool, 'questions');
    }

    public async insertOne(question: InsertQuestion) {
        const {
            text,
            text_for_guess,
            follow_up,
            deck_id,
            age_rating,
            status
        } = question;
        const query = {
            text: 'INSERT INTO questions (text, text_for_guess, follow_up, deck_id, age_rating, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [
                text,
                text_for_guess,
                follow_up,
                deck_id,
                age_rating,
                status
            ]
        }
        return this.pool.query(query)
    }
}

export default Question;