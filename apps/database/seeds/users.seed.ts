import { Pool } from 'pg';
import { cypressTestUsers } from '@whosaidtrue/util';
import { Users } from '@whosaidtrue/data';

export const insertCypressUsers = (pool: Pool) => {
    const users = new Users(pool);

    cypressTestUsers.forEach(async user => {
        try {
            await users.register(user.email, user.password, 'www.whosaidtrue.com')
            console.log('inserted cypress test user', user)
        } catch (e) {
            console.error(`error inserting test user`, user);
            console.error(e)
        }
    })

}