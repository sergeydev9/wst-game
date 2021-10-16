import http from 'http';
import { pool } from './db'
import { logger } from '@whosaidtrue/logger';
import initializeSocket from './socket';

// create http server
const server = http.createServer((req, res) => {
    if (req.url === '/healthz') {
        res.end("OK");
    } else {
        res.statusCode = 404;
        res.end();
    }
});

// set up socket server
initializeSocket(server);

// test db connection, end process if db unreachable
(async () => {
    try {
        await pool.connect();
    } catch {
        logger.fatal('Database unreachable. Exiting node process')
        process.exit(1);
    }
})();

// no dangling connections
process.on('exit', () => pool.end())

const port = process.env.SOCKET_PORT || 4001;

// start
server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${process.env.NODE_ENV} =======`);
    logger.info(`🚀 Socket server listening on the port ${port}`);
    logger.info(`=================================`);
});