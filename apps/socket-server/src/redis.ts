import Redis from 'ioredis';
import { logger } from '@whosaidtrue/logger';

// create Redis client
export const pubClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  family: 4,
  db: 0,
  keepAlive: 1,
});

pubClient.on('error', (err) => {
  logger.fatal({
    message: 'Error in redis connection. Shutting socket-server down.',
    err,
  });
  process.exit(1);
});
export const subClient = pubClient.duplicate();

subClient.on('error', (err) => {
  logger.fatal({
    message: 'Error in redis connection. Shutting socket-server down',
    err,
  });
  process.exit(1);
});
