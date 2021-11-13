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

    public reportChoices(seen: number[], chosen: number | undefined): Promise<QueryResult>[] {

        if (chosen) {
            const seenQuery = {
                text: `UPDATE generated_names SET times_displayed = times_displayed + 1 WHERE id = ANY($1)`,
                values: [[...seen, chosen]]
            }

            const chosenQuery = {
                text: 'UPDATE generated_names SET times_chosen = times_chosen + 1 WHERE id = $1',
                values: [chosen]
            }

            return [this.pool.query(seenQuery), this.pool.query(chosenQuery)]
        } else {
            const seenQuery = {
                text: `UPDATE generated_names SET times_displayed = times_displayed + 1 WHERE id = ANY($1)`,
                values: [[...seen]]
            }

            // keep as an array to allow caller to not have to worry about whether or not there are 2 promises
            return [this.pool.query(seenQuery)]
        }

    }
}

export default GeneratedNames