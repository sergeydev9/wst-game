import { Request } from 'express';
import { logger } from '@whosaidtrue/logger';


/**
 * Extract the origin from an incoming request.
 *
 * Used to populate the domain columsn in user and game tables.
 */
export function getDomain(request: Request) {
    const origin = request.get('origin');

    if (origin.includes('whosaidtrue.com')) {
        return 'www.whosaidtrue.com';
    } else if (origin.includes('whosaidtrueforschools.com')) {
        return 'www.whosaidtrueforschools.com';
    } else {

        if (process.env.NODE_ENV === 'production') {
            throw new Error('unknown origin')

        } else {
            logger.debug({ origin });
            return origin;
        }
    }

}