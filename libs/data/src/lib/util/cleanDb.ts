import { Pool } from 'pg';
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
export function cleanDb(pool: Pool) {

    const promises = [
        pool.query('TRUNCATE orders CASCADE'),
        pool.query(`TRUNCATE decks CASCADE`),
        pool.query(`TRUNCATE users CASCADE`),
        pool.query(`TRUNCATE user_decks CASCADE`),
        pool.query(`TRUNCATE games CASCADE`),
        pool.query(`TRUNCATE questions CASCADE`),
        pool.query(`TRUNCATE game_questions CASCADE`),
        pool.query(`TRUNCATE game_players CASCADE`),
        pool.query(`TRUNCATE game_answers CASCADE`),
        pool.query(`TRUNCATE generated_names CASCADE`),
        pool.query(`TRUNCATE reset_codes CASCADE`),
    ];

    return Promise.all(promises);
}
