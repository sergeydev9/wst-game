import { Pool } from 'pg';
import Dao from '../base.dao';

class Orders extends Dao {
    constructor(pool: Pool) {
        super(pool, 'orders')
    }
}

export default Orders