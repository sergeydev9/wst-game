import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

export class OneLiners extends Dao {
    constructor(pool: Pool) {
        super(pool, 'one_liners');
    }


    /**
     * Get 10 random one liners
     *
     * @param {boolean} clean
     *
     * @returns {Promise<QueryResult>} [{text: string, clean: boolean}]
     */
    getSelection(clean: boolean): Promise<QueryResult> {
        const query = {
            text: `
                SELECT text, clean
                FROM one_liners
                WHERE clean = $1
                ORDER BY random()
                LIMIT 10
            `,
            values: [clean]
        }

        return this.pool.query(query);
    }
}

export default OneLiners;