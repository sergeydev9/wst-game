import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import Games from './games.dao';
import TEST_GAMES from '../test-objects/games';


describe('Decks dao', () => {
    let pool: Pool;
    let games: Games;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        games = new Games(pool);
    })

    beforeEach(async () => {
        // clean DB
        await pool.query(`DELETE FROM decks WHERE id > 0`);
        await pool.query(`DELETE FROM users WHERE id > 0`);
        await pool.query(`DELETE FROM user_decks WHERE id > 0`);
    })

    afterAll(async () => {
        pool.end()
    })

    // describe('insertOne', () => {

    //     it('should insert a new game row', async () => {
    //         const { access_code, status } = TEST_GAMES[0];
    //         const { rows } = await games.insertOne({ access_code, status });
    //         expect(rows.length).toEqual(1);
    //     })
    // })
})