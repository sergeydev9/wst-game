import { Request, Response, Router } from 'express';
import { idQuery, getDeckSelectionQuery } from '@whosaidtrue/validation';
import { logger } from '@whosaidtrue/logger';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { decks } from '../../db';
import { DeckSelectionResponse, TokenPayload } from '@whosaidtrue/api-interfaces';

const router = Router();

router.get('/selection', [...getDeckSelectionQuery], async (req: Request, res: Response) => {

    const { clean } = req.query;
    const cleanAsBool = clean === 'true';

    try {
        // Check header for token
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        let id: number;
        // if there is a token, verify it and extract user id
        if (token) {
            try {
                const { user } = jwt.verify(token, process.env.JWT_SECRET) as { user: TokenPayload }
                id = user.id;
                //  eslint-disable-next-line
            } catch (_) { }  // fail silently if token invalid
        }

        // if id found, send user 2 sets of decks.
        // One set is an array of all the decks they own,
        // the other is an array of decks they don't own.
        if (id) {
            // get decks
            const [userDecks, notOwned] = await Promise.all(
                [decks.getUserDecks(id, cleanAsBool),
                decks.userDeckSelection(id, 0, 100, cleanAsBool)
                ]);

            // send
            res.status(200).json({
                owned: userDecks.rows,
                notOwned: notOwned.rows
            } as DeckSelectionResponse)

        } else {
            // no valid id, send guest selection and free decks
            const [free, notFree] = await Promise.all([decks.getFreeDecks(cleanAsBool), decks.guestDeckSelection(0, 100, cleanAsBool)])
            res.status(200).json({ owned: free.rows, notOwned: notFree.rows } as DeckSelectionResponse)
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