/**
 * Insert names into the generated names table. These names
 * are test samples taken from https://github.com/docker/engine/blob/master/pkg/namesgenerator/names-generator.go
 *
 */
import { generateName } from '@whosaidtrue/data';
import { Pool } from 'pg';
import format from 'pg-format'


/**
 * Insert given number of randomly constructed names into the database
 *
 * @param {Pool} pool
 * @param {number} num
 */
const insertNames = async (pool: Pool, num: number) => {
    const names = []
    let count = 0

    while (count < num) {
        names.push([generateName(), true])
        count++
    }

    const query = {
        text: format('INSERT INTO generated_names (name, clean) VALUES %L', names),
    }

    return pool.query(query);
}

export default insertNames;