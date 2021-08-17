import { Pool } from 'pg';
import Dao from '../base.dao';

class GeneratedNames extends Dao {
    constructor(pool: Pool) {
        super(pool, 'generated_names')
    }
}

export default GeneratedNames