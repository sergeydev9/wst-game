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
        pool.query('DELETE FROM orders WHERE id > 0'),
        pool.query(`DELETE FROM decks WHERE id > 0`),
        pool.query(`DELETE FROM users WHERE id > 0`),
        pool.query(`DELETE FROM user_decks WHERE id > 0`),
        pool.query(`DELETE FROM games WHERE id > 0`),
        pool.query(`DELETE FROM questions WHERE id > 0`),
        pool.query(`DELETE FROM game_questions WHERE id > 0`),
        pool.query(`DELETE FROM game_players WHERE id > 0`),
        pool.query(`DELETE FROM game_answers WHERE id > 0`),
        pool.query(`DELETE FROM generated_names WHERE id > 0`),
        pool.query(`DELETE FROM reset_codes WHERE id > 0`),
    ];

    return Promise.all(promises);
}
