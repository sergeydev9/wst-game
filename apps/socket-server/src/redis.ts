import Redis from 'ioredis';

// create Redis client
export const pubClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    family: 4,
    db: 0
});
export const subClient = pubClient.duplicate();
