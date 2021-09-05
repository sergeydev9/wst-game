import { Request, Response, Router } from 'express';
import { passport } from '@whosaidtrue/middleware';
import { deckId } from '@whosaidtrue/validation'
import { logger } from '@whosaidtrue/logger';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { games } from '../../db';
import { CreateGameRequest, TokenPayload, CreateGameResponse } from '@whosaidtrue/api-interfaces';

const router = Router();

// TODO finish
router.post('/join', async (req: Request, res: Response) => {
    const id = req.query.access_code;
})

/**
 * Create a game and set user as its host.
 * Should only be called once per game.
 */
router.post('/create', [...deckId], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { deckId } = req.body as CreateGameRequest;
    const { id } = req.user as TokenPayload;

    try {
        const { rows } = await games.create(id, deckId);

        // should never happen. If game creation failed,
        // db will throw. But this is here just in case.
        if (!rows[0]) {
            res.status(500).send(ERROR_MESSAGES.unexpected)
        } else {
            res.status(201).json({ game_id: rows[0].id, access_code: rows[0].access_code } as CreateGameResponse)
        }
    } catch (e) {
        logger.error(`inputs: user id: ${id}, deck id: ${deckId}, error: ${e}, stack: ${e.stack}`)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})
export default router;