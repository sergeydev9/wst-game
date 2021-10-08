import http from 'http';
import { pool } from './db'
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { logger } from '@whosaidtrue/logger';
import { verify } from 'jsonwebtoken';
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { GameTokenPayload } from '@whosaidtrue/api-interfaces';
import registerHandlers from './registerHandlers';
import { subClient, pubClient, } from './redis';
import { getCurrentPlayersKey, playerValueString } from './util';
import { PlayerRef } from '@whosaidtrue/app-interfaces';

declare module 'socket.io' {
    interface Socket {
        gameId: number;
        isHost: boolean;
        playerId: number;
        playerName: string;
    }
}

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

// verify token and add user data to socket
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
io.on('connection', async socket => {

    // join room
    socket.join(`${socket.gameId}`);

    // register event handlers
    registerHandlers(socket);

    const playersKey = getCurrentPlayersKey(socket) // stores list of current players for game

    // add player to redis
    const insertResult = await pubClient.sadd(playersKey, playerValueString(socket))
    logger.debug(`Insert user result: ${insertResult}`)

    // TODO: fetch game state here and make this into a pipeline
    // get list of current players
    const playersResponse = await pubClient.smembers(playersKey)
    const players = playersResponse.map(player => JSON.parse(player)) as PlayerRef[] // players are stored as a string
    logger.debug(`Players response: ${playersResponse}`)

    // send players to client
    socket.emit(types.SET_CURRENT_PLAYERS, { players } as payloads.SetCurrentPlayers)
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