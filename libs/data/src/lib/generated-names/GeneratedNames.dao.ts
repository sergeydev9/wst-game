import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

export interface NameChoice {
    name_id: number;
    chosen: boolean;
}

class GeneratedNames extends Dao {
    constructor(pool: Pool) {
        super(pool, 'generated_names')
    }

    /**
     * Record that a name was seen, and whether or not it was chosen.
     *
     * @param {NameChoice[]} choices
     * @return {*}  {Promise<QueryResult>}
     * @memberof GeneratedNames
     */
    // public async reportChoices(choices: NameChoice[]): Promise<QueryResult> {}


    /**
     * Get the specified number of randomly selected generated name rows.
     *
     * This method calls a function defined in the DB itself.
     *
     * @param {number} num
     * @return {*}  {Promise<QueryResult>}
     * @memberof GeneratedNames
     */
    public async getChoices(num: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * FROM get_random_names($1)',
            values: [num]
        }

        return this.pool.query(query);
    }
}

export default GeneratedNames