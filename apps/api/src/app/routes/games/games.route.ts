import { Request, Response, Router } from 'express';
import { passport, signGameToken } from '@whosaidtrue/middleware';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { deckId, accessCodeQuery, joinGame } from '@whosaidtrue/validation'
import { logger } from '@whosaidtrue/logger';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { games } from '../../db';
import {
    CreateGameRequest,
    TokenPayload,
    CreateGameResponse,
    StatusRequestResponse,
    JoinGameRequest,
    JoinGameResponse
} from '@whosaidtrue/api-interfaces';

const router = Router();

router.post('/join', [...joinGame], async (req: Request, res: Response) => {

    const { access_code, name } = req.body as JoinGameRequest;
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

    try {
        const result = await games.join(access_code, name, id);
        const { playerId, playerName, gameId, isHost, status } = result;

        // if player trying to join a finished game
        if (status === 'finished') {
            return res.status(403).send('Game Finished')
        }

        const gameToken = signGameToken(playerId, playerName, isHost, gameId); // put game info in signed token
        res.status(201).json({ ...result, gameToken } as JoinGameResponse)
    } catch (e) {
        if (e.message === 'Game not found') {
            res.status(404).send('Game not found')
        } else {
            logger.error('error joining game', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }
    }
});

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
        if (rows.length === 0) {
            res.status(500).send(ERROR_MESSAGES.unexpected)
        } else {
            res.status(201).json({ game_id: rows[0].id, access_code: rows[0].access_code } as CreateGameResponse)
        }
    } catch (e) {
        logger.error('error creating game', e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
});

/**
 * Get status of a game from access_code.
 * This route is used when a user first tries to join a game/choose their name.
 *
 * Return 404 if game doesn't exist. Else return status.
 */

router.get('/status', [...accessCodeQuery], async (req: Request, res: Response) => {
    const { access_code } = req.query as any;

    try {
        const { rows } = await games.gameStatusByAccessCode(access_code)
        if (!rows.length) {
            res.status(404).send('Could not find an ongoing game with that access_code')
        } else {
            res.status(200).json({ status: rows[0].status } as StatusRequestResponse)
        }
    } catch (e) {
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
});

export default router;