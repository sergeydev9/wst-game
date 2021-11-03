import { Pool } from 'pg'
import format from 'pg-format';
import { testQuestions } from '@whosaidtrue/data';

const insertQuestions = async (pool: Pool, num: number, deckId: number) => {
    const questionObjects = [...testQuestions(num, deckId)];

    //need an array of the values for each question
    const questions = questionObjects.map(obj => [...Object.values(obj)])
    const query = {
        text: format(`INSERT INTO questions (
            text,
            deck_id,
            text_for_guess,
            status,
            age_rating,
            follow_up,
            category
        ) VALUES %L`, questions)
    }

    return pool.query(query);
}

export default insertQuestions