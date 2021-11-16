import { Request, Response, Router } from 'express';
import { passport, signGameToken } from '@whosaidtrue/middleware';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { deckId, accessCodeQuery, joinGame, gameIdBody } from '@whosaidtrue/validation'
import { logError } from '@whosaidtrue/logger';
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
import { getDomain } from '../../getDomain';
import extractOptionalId from '../../extractOptionalId';

const router = Router();

router.post('/join', [...joinGame], async (req: Request, res: Response) => {

    const { access_code, name } = req.body as JoinGameRequest;
    const id = extractOptionalId(req);

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
            logError('error joining game', e)
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
        const domain = getDomain(req)
        const { rows } = await games.create(id, deckId, domain);

        // should never happen. If game creation failed,
        // db will throw. But this is here just in case.
        if (rows.length === 0) {
            res.status(500).send(ERROR_MESSAGES.unexpected)
        } else {
            res.status(201).json({ game_id: rows[0].id, access_code: rows[0].access_code } as CreateGameResponse)
        }
    } catch (e) {
        logError('error creating game', e)
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
    const { access_code } = req.query as { access_code: string };

    try {
        const { rows } = await games.gameStatusByAccessCode(access_code)
        if (!rows.length) {
            res.status(404).send('Could not find an ongoing game with that access_code')
        } else {
            res.status(200).json({ status: rows[0].status } as StatusRequestResponse)
        }
    } catch (e) {
        logError('Error fetching game status', e);
        res.status(500).send(ERROR_MESSAGES.unexpected);
    }
});

/**
 * End a game early. This endpoint gets called if a host leaves intentionally
 * while on either the "invite" or the "choose name" screens.
 *
 * When they are on those pages, they haven't joined the socket server yet,
 * so that server can't handle the event.
 */
router.patch('/end', [...gameIdBody], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { gameId } = req.body;
    const { id } = req.user as TokenPayload;

    try {
        const result = await games.endGameIfHost(gameId, id);

        if (result.rowCount === 1) {
            res.sendStatus(204);

        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        logError('Error ending game', e);
        res.status(500).send(ERROR_MESSAGES.unexpected);
    }

})

export default router;