import { DatabaseError, Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { Email } from "@whosaidtrue/app-interfaces";
import Emails from "./emails.dao";
import { Users } from "@whosaidtrue/data";
import _ from "lodash";


describe('Emails', () => {
    let pool: Pool;
    let emails: Emails;
    let users: Users;
    let userId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        emails = new Emails(pool);
        users = new Users(pool);

    });

    beforeEach(async () => {
        await cleanDb(pool);
        userId = (await users.register('email', 'password', 'test.com')).rows[0].id;
        await emails.pool.query(`INSERT INTO email_templates (key, sendgrid_template_id) VALUES ('template_key', 'sendgrid_template_id')`);
    });

    afterAll(() => {
        pool.end();
    });

    describe('insertOne', () => {

        it('should return object details', async () => {
            const expected = {
                user_id: userId,
                from: 'from',
                to: 'to',
                cc: 'cc',
                bcc: 'bcc',
                subject: 'subject',
                text: 'text',
                html: 'html',
                template_key: 'template_key',
                template_data: 'template_data'
            };

            const actual = (await emails.insertOne(expected)).rows[0];

            expectEmailsEqual(actual, expected as Email, ['id', 'created_at', 'updated_at']);
            expect(actual.id).toBeDefined();
            expect(actual.created_at).toBeDefined();
            expect(actual.updated_at).toBeDefined();
        });


        it('should create object in db', async () => {
            const email = {
                user_id: userId,
                from: 'from',
                to: 'to',
                cc: 'cc',
                bcc: 'bcc',
                subject: 'subject',
                text: 'text',
                html: 'html',
                template_key: 'template_key',
                template_data: 'template_data'
            };
            const expected = (await emails.insertOne(email)).rows[0];

            const actual = (await emails.getById(expected.id)).rows[0];

            expectEmailsEqual(actual, expected);
        });

        it('should require user_id', async () => {
            try {
                await emails.insertOne({ user_id: null, to: 'to', text: 'text' });
                fail();
            } catch (e) {
                expect(e).toEqual(new DatabaseError('null value in column "user_id" violates not-null constraint', 1, 'error'))
            }
        });

        it('should require to address', async () => {
            try {
                await emails.insertOne({ user_id: userId, to: null, text: 'text' });
                fail()
            } catch (e) {
                expect(e).toEqual(new DatabaseError('null value in column "to" violates not-null constraint', 1, 'error'))
            }
        });

        it('should require email body', async () => {
            try {
                await emails.insertOne({ user_id: userId, to: 'to', text: null });
                fail()
            } catch (e) {
                expect(e).toEqual(new DatabaseError('new row for relation "emails" violates check constraint "email_text_html_or_template_required"', 1, 'error'))
            }

            // any one of text, html or template_key should work
            await emails.insertOne({ user_id: userId, to: 'to', text: 'text' });
            await emails.insertOne({ user_id: userId, to: 'to', html: 'html' });
            await emails.insertOne({ user_id: userId, to: 'to', template_key: 'template_key' });
        });

    });

});

function expectEmailsEqual(actual: Email, expected: Email, exclude: string[] = []) {
    const all = ['id', 'from', 'to', 'cc', 'bcc', 'subject', 'text', 'html', 'template_key', 'template_data', 'created_at', 'updated_at'];
    const check = _.difference(all, exclude);

    for (const prop of check) {
        expect(actual[prop]).toEqual(expected[prop]);
    }
}
