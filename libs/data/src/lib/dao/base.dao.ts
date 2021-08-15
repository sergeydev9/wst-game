import { Pool } from 'pg';

/**
 * Abstract base class for all database access objects.
 * Provides a connection pool to use for sending queries.
 *
 * @class Dao
 */
abstract class Dao {
    constructor(protected readonly pool: Pool) { }
}

export default Dao;