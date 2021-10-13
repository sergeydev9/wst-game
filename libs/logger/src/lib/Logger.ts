import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV === 'production' ? false : { // log to stdout, pretty print in dev only
    colorize: true,
    errorLikeObjectKeys: ['err', 'error'],
    translateTime: true,
  },
})

export function debugObjects(message: string, objects: Record<string, unknown>) {
  logger.debug({ message: message, objects: objects })
}

export function logIncoming(event: string, message: unknown) {
  logger.debug({ "IncomingEvent": `[${event}]`, message })
}

export function logOutgoing(event: string, message: unknown, recipients: "all" | "others") {
  logger.debug({ "OutgoingEvent": `[${event}]`, message, recipients })
}

/**
 * allows logging of errors in a single statment
 */
export function logError(message: string, err: any) {
  logger.error({ message, err })
}