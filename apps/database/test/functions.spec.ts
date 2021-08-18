import { Client } from 'pg';

/* ALL TESTS ASSUME MIGRATIONS HAVE ALREADY BEEN RUN */
// TODO: Having to manually run seeds and migrations before testing is not a good way to do things. Need to decide on a method.
describe('database custom functions', () => {
    let client: Client;
    beforeAll(async () => {
        // TODO: Shouldn't run tests against dev db. Come up with better process.
        client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'password',
            database: 'whosaidtrue-dev'
        });
        await client.connect();
    })

    describe('number_true_answers', () => {

        it('should return the expected number', async () => {

            // result
            const result = await client.query(`SELECT number_true_answers(1)`);
            return expect(result.rows[0].number_true_answers).toEqual(2);
        })

    })

    describe('update_updated_at_column', () => {

        it('should change the value of updated_at after an update', async () => {
            const query = `SELECT updated_at FROM game_answers WHERE game_answers.id = 1`
            const old = await client.query(query);
            const update = await client.query('UPDATE game_answers SET "numberTrueGuess" = 50 WHERE game_answers.id = 1 RETURNING updated_at')
            return expect(update.rows[0].updated_at).not.toEqual(old.rows[0].updated_at)
        })
    })

})