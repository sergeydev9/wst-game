import {Pool} from 'pg';

/**
 * Delete everything from every table DON'T EVER USE THIS
 * OUTSIDE OF TEST RUNS.
 *
 * @example
 * await cleanDb(pool);
 *
 * @export
 * @param {Pool} pool
 */
export async function cleanDb(pool: Pool) {

    if (!(pool['options'].database as string).includes("test")) {
        throw new Error("Not a test db");
    }

    await pool.query('TRUNCATE orders CASCADE');
    await pool.query(`TRUNCATE decks CASCADE`);
    await pool.query(`TRUNCATE users CASCADE`);
    await pool.query(`TRUNCATE user_decks CASCADE`);
    await pool.query(`TRUNCATE games CASCADE`);
    await pool.query(`TRUNCATE questions CASCADE`);
    await pool.query(`TRUNCATE game_questions CASCADE`);
    await pool.query(`TRUNCATE game_players CASCADE`);
    await pool.query(`TRUNCATE game_answers CASCADE`);
    await pool.query(`TRUNCATE generated_names CASCADE`);
    await pool.query(`TRUNCATE reset_codes CASCADE`);
}
