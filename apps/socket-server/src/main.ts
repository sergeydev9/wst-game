import { pool } from './db'
import { logger } from '@whosaidtrue/logger';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from "socket.io";
import http from 'http';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis"
import { GameTokenPayload } from '@whosaidtrue/api-interfaces';
import registerHandlers from './registerHandlers';

declare module 'socket.io' {
    interface Socket {
        gameId: number;
        isHost: boolean;
        playerId: number;
        playerName: string;
    }
}

// create Redis clients
const pubClient = createClient({ host: process.env.REDIS_HOST, port: 6379, password: process.env.REDIS_PASSWORD });
const subClient = pubClient.duplicate();

// create socket server
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN,
        methods: ["GET", "POST"]
    }
});

// create redis adapter and add it to server
io.adapter(createAdapter(pubClient, subClient));

// middleware to verify token and add user data to socket
io.use((socket, next) => {
    const token = socket.handshake.auth.token as string;

    try {
        const decoded = verify(token, process.env.JWT_SECRET) as GameTokenPayload;
        socket.gameId = decoded.gameId;
        socket.isHost = decoded.isHost;
        socket.playerId = decoded.playerId;
        socket.playerName = decoded.playerName;

        next();
    } catch {
        next(new Error('Unauthorized'))
    }
});

// Join game room and register handlers
io.on('connection', socket => {
    socket.join(`${socket.gameId}`)
    registerHandlers(socket);
});


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

server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${process.env.NODE_ENV} =======`);
    logger.info(`🚀 App listening on the port ${port}`);
    logger.info(`=================================`);
});