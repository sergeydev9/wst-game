import { insertNamesQuery } from '@whosaidtrue/data';
import { Pool } from 'pg';

/**
 * Insert given number of randomly constructed names into the database
 *
 * @param {Pool} pool
 * @param {number} num
 */
const insertNames = async (pool: Pool, num: number) => {
    return pool.query(insertNamesQuery(num));
}

export default insertNames;