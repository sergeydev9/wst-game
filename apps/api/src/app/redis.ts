import Redis from 'ioredis';
import { logger } from '@whosaidtrue/logger';

// create Redis client
export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    family: 4,
    db: 0
});

redisClient.on("error", err => {
    logger.fatal({
        message: 'Error in redis connection. Shutting api down.',
        err
    });
    process.exit(1);
})