import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

class FreeCreditSignups extends Dao {
    constructor(pool: Pool) {
        super(pool, 'free_credit_signups')
    }

    /**
     * Add a new credit award
     *
     * @throws DatabaseError
     * if:
     *  - Player name is not available
     *  - Bad game_id
     *
     * @param {string} email
     * @return  {Promise<QueryResult>}
     * @memberof GamePlayers
     */
    public insertOne(email: string): Promise<QueryResult> {

        const query = {
            text: `
                INSERT INTO free_credit_signups (email)
                VALUES ($1)
                `,
            values: [email]
        }

        return this.pool.query(query);
    }
}

export default FreeCreditSignups