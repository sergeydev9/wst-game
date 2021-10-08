import Redis from 'ioredis';
import { Socket } from "socket.io";

// create Redis clients
export const pubClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD,
    family: 4,
    db: 0
});
export const subClient = pubClient.duplicate();
