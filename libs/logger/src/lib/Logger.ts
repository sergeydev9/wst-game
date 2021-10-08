import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV === 'production' ? false : true, // log to stdout, pretty print in dev only
})