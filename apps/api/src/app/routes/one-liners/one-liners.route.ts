import { QueryResult } from 'pg';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { Request, Response, Router } from 'express';
import { logError } from '@whosaidtrue/logger';
import { getDomain } from '../../getDomain';
import { oneLiners } from '../../db';
import addNewLines from '../../addNewLines';

const router = Router();

/**
 * Gets 10 randomly selected one liners
 *
 * Requests that come from regular domain return clean and non-clean one liners
 *
 * Requests that come from the 4 schools domain retun only clean one liners
 */
router.get('/', async (req: Request, res: Response) => {

    try {
        const domain = getDomain(req);
        const result = await oneLiners.getSelection(domain === process.env.FOR_SCHOOLS_DOMAIN);

        // replace escaped newlines with unescaped new lines
        const processed = result.rows.map(oneLiner => {
            oneLiner.text = addNewLines(oneLiner.text);
            return oneLiner;
        })

        return res.status(200).json({ oneLiners: processed })
    } catch (e) {
        logError('Error while fetching one liner selection', e);
        res.status(500).send(ERROR_MESSAGES.unexpected);
    }
})

export default router;