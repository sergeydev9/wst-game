import { insertNamesQuery } from '@whosaidtrue/data';
import { Pool } from 'pg';

/**
 * Insert given number of randomly constructed names into the database
 *
 * @param {Pool} pool
 * @param {number} num
 */
const insertNames = async (pool: Pool, num: number) => {
    let count = 0;
    try {
        const result = await pool.query(insertNamesQuery(num));
        count = result.rowCount
    } catch (e) {
        console.error(e);
    }

    return count;
}

export default insertNames;