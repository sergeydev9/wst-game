import { Pool } from 'pg';

/**
 * Abstract base class for all database access objects.
 * Provides a connection pool to use for sending queries, as
 * well as some basic common query methods.
 *
 * @class Dao
 */
abstract class Dao {
    constructor(protected readonly _pool: Pool, private readonly tableName: string) { }

    public async getById(id: number) {
        const query = {
            text: `SELECT * FROM $2 WHERE id = $1`,
            values: [id, this.tableName]
        }
        return this._pool.query(query);
    }

    public async deleteById(id: string) {
        const query = {
            text: `DELETE FROM ${this.tableName} WHERE id = $1`,
            values: [id]
        }
        return this._pool.query(query);
    }

    public get pool() {
        return this._pool;
    }

    // use to get a client for transactions. DO NOT USE POOL FOR TRANSACTIONS.
    public get client() {
        return this._pool.connect()
    }
}

export default Dao;