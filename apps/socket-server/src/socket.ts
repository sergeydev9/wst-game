import http from 'http';
import { verify } from 'jsonwebtoken';
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { GameTokenPayload } from '@whosaidtrue/api-interfaces';
import registerListeners from './listener-helpers/registerListeners';
import { subClient, pubClient, } from './redis';
import initializeGame from './listener-helpers/initializeGame';
import initializePlayer from './listener-helpers/initializePlayer';
import Keys from './keys';

declare module 'socket.io' {
    interface Socket {
        gameId: number;
        isHost: boolean;
        playerId: number;
        playerName: string;
        keys: Keys;
    }
}

/**
 * Set up the socket server
 */
const initializeSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.DOMAIN,
            methods: ["GET", "POST"]
        }
    });

    // create redis adapter and attach to server
    io.adapter(createAdapter(pubClient, subClient));

    /**
     * Middleware
     */

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

    // attach redis keys to socket
    io.use((socket, next) => {
        socket.keys = new Keys(socket)
        next()
    })

    // if client was removed, prevent them from connecting
    io.use(async (socket, next) => {

        const isRemoved = await pubClient.sismember(socket.keys.removedPlayers, `${socket.playerId}`);

        if (isRemoved) {
            next(new Error('Unauthorized'));
        } else {
            next();
        }
    })

    /**
     * Connection handler
     */

    // Join game room and register listeners
    io.on('connection', async socket => {

        // join room
        socket.join(`${socket.gameId}`);

        // register event handlers
        registerListeners(socket, io);

        // set up game store
        initializeGame(socket);

        // add player to store
        initializePlayer(socket);
    });

    return io;
}

export default initializeSocket;
