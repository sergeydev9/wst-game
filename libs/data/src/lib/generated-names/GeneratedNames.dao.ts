import { Pool, QueryResult } from 'pg';
import { NameObject } from '@whosaidtrue/app-interfaces';
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
     * If clean is set to 'true' returns only 'clean' names. Otherwise,
     * chooses either clean or not clean names.
     *
     * @param {number} num
     * @return {*}  {Promise<QueryResult>}
     * @memberof GeneratedNames
     */
    public getChoices(num: number, clean = false): Promise<QueryResult> {
        const query = {
            text: 'SELECT * FROM get_name_choices($1, $2)',
            values: [num, clean]
        }

        return this.pool.query(query);
    }

    //TODO: finish. Need to write function still
    public reportChoices(seen: number[], chosen: number): Promise<QueryResult> {
        const query = {
            text: `record_name_selection($1, $2)`,
            values: [seen, chosen]
        }

        return this.pool.query(query)
    }
}

export default GeneratedNames