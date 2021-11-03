import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import FreeCreditSignups from './FreeCreditSignups.dao';
import { cleanDb } from '../util/cleanDb';


describe('FreeCreditSignups', () => {
    let pool: Pool;
    let signups: FreeCreditSignups;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        signups = new FreeCreditSignups(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        jest.clearAllMocks();
    })

    afterAll(() => {
        pool.end();
    })

    describe('insertOne', () => {

        it('should return player rowCount 1 if successful', async () => {
            const { rowCount } = await signups.insertOne('test@test.com')
            expect(rowCount).toEqual(1);
        })

        it('should throw if a request already exists for the email', async () => {
            await signups.insertOne('test@test.com')

            try {
                await signups.insertOne('test@test.com')
            } catch (e) {
                expect(e).toEqual(new DatabaseError("duplicate key value violates unique constraint \"free_credit_signups_email_key\"", 1, "error"))
            }
        })


    })

})