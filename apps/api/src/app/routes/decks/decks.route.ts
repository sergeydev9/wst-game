import { Request, Response, Router } from 'express';
import { idQuery } from '@whosaidtrue/validation';
import { logger } from '@whosaidtrue/logger';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { decks } from '../../db';

const router = Router();

/**
 * Get a complete deck row by id
 */
router.get('/', [...idQuery], async (req: Request, res: Response) => {
    try {
        // get id from query and cast it to integer
        const { id } = req.query;
        const idNum = parseInt(id as string) // validation middleware guarantees this conversion works

        // send request to db
        const { rows } = await decks.getById(idNum);

        // if not found, 404
        if (!rows.length) {
            res.status(404).send("Could not find deck");
        } else {
            // if found, send result
            res.status(200).json(rows[0])
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

export default router;