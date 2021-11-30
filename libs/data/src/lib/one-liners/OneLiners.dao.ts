import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

export class OneLiners extends Dao {
    constructor(pool: Pool) {
        super(pool, 'one_liners');
    }


    /**
     * Get 10 random one liners
     *
     * If 'clean' = true, return only clean one liners, else return either clean or not clean
     *
     * @param {boolean} clean
     *
     * @returns {Promise<QueryResult>} [{text: string, clean: boolean}]
     */
    getSelection(clean?: boolean): Promise<QueryResult> {
        let query: { text: string, values?: boolean[] };

        if (clean) {
            query = {
                text: `
                    SELECT text, clean
                    FROM one_liners
                    WHERE clean = $1
                    ORDER BY random()
                    LIMIT 10
                `,
                values: [clean]
            }
        } else {
            query = {
                text: `
                    SELECT text, clean
                    FROM one_liners
                    ORDER BY random()
                    LIMIT 10
                `,
            }
        }

        return this.pool.query(query);
    }
}

export default OneLiners;