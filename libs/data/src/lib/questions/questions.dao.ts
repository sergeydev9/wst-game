import { InsertQuestion } from '@whosaidtrue/app-interfaces';
import { Pool } from 'pg';
import Dao from '../base.dao';


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