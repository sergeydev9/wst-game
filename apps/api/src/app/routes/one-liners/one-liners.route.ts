import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { Request, Response, Router } from 'express';
import { logError } from '@whosaidtrue/logger';
import { getDomain } from '../../getDomain';
import { oneLiners } from '../../db';
import { QueryResult } from 'pg';

const router = Router();

/**
 * Gets 10 randomly selected one liners
 *
 * Requests that come from regular domain return only non-clean one liners
 *
 * Requests that come from the 4 schools domain retun only clean one liners
 */
router.get('/', async (req: Request, res: Response) => {

    try {
        const domain = getDomain(req);
        let result: QueryResult;

        // DOMAIN is normal domain
        if (domain === process.env.DOMAIN) {
            result = await oneLiners.getSelection(false);
        } else {
            result = await oneLiners.getSelection(true);
        }

        return res.status(200).json({ oneLiners: result.rows })
    } catch (e) {
        logError('Error while fetching one liner selection', e);
        res.status(500).send(ERROR_MESSAGES.unexpected);
    }
})

export default router;