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

    // TODO: finish
    // public async reportChoices(choices: NameChoice[]): Promise<QueryResult> {

    // }
}

export default GeneratedNames