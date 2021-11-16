import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { Email, InsertEmail, Template } from "@whosaidtrue/app-interfaces";

class Emails extends Dao {
    constructor(pool: Pool) {
        super(pool, 'emails')
    }

    public insertOne(email: InsertEmail): Promise<QueryResult<Email>> {

        const query = {
            text: `INSERT INTO emails (user_id,
                                       "from",
                                       "to",
                                       cc,
                                       bcc,
                                       subject,
                                       text,
                                       html,
                                       template_key,
                                       template_data)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            values: [
                email.user_id || null,
                email.from,
                email.to,
                email.cc,
                email.bcc,
                email.subject,
                email.text,
                email.html,
                email.template_key,
                email.template_data
            ]
        };

        return this.pool.query(query);
    }

    public getDetails(id: number): Promise<QueryResult<Email & Template>> {
        const query = {
            text: `
                SELECT *
                FROM emails
                LEFT JOIN email_templates ON "key" = template_key
                WHERE id = $1`,
            values: [id]
        };

        return this.pool.query(query);
    }
}

export default Emails