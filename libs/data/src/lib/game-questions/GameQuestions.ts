import { Pool } from 'pg';
import Dao from '../base.dao';

class GameQuestions extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_questions')
    }
}

export default GameQuestions