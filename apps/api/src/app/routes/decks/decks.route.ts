import { Request, Response, Router } from 'express';
import { idQuery } from '@whosaidtrue/validation';
import { logger } from '@whosaidtrue/logger';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { decks } from '../../db';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

const router = Router();

// TODO implement pagination and age rating filtering
router.get('/selection', async (req: Request, res: Response) => {
    try {
        // Check header for token
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let id;
        // if there is a token, verify it and extract user id
        if (token) {
            try {
                const { user } = jwt.verify(token, process.env.JWT_SECRET) as { user: TokenPayload }
                id = user.id;
            } catch { }  // fail silently if token invalid
        }

        // if id found, send user 2 sets of decks.
        // One set is an array of all the decks they own,
        // the other is an array of decks they don't own.
        if (id) {
            const [userDecks, notOwned] = await Promise.all([decks.getUserDecks(id), decks.userDeckSelection({ pageNumber: 0, pageSize: 100, userId: id })])

            // Should match type DeckSelectionResponse in @whosaidtrue/api-interfaces
            res.status(200).json({
                owned: userDecks.rows,
                notOwned: notOwned.rows
            })

        } else {
            // no valid id, send guest selection
            const selection = await decks.deckSelection({ pageNumber: 0, pageSize: 100 })

            // Should match type DeckSelectionResponse in @whosaidtrue/api-interfaces
            res.status(200).json({ notOwned: selection.rows, owned: [] })
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

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