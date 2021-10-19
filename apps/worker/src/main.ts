import { pool } from './db'
import { logger } from '@whosaidtrue/logger';
import Worker from "./worker";

// test db connection, end process if db unreachable
(async () => {
    try {
        await pool.query("SELECT 1");
    } catch {
        logger.fatal('Database unreachable. Exiting node process');
        process.exit(1);
    }

})();


// start the background worker
const worker = new Worker();
worker.start();

// no dangling connections
process.on('exit', () => {
    worker.stop();
    pool.end();
});
