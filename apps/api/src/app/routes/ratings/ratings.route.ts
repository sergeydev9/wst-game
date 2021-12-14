import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { idQuery, appRating, questionRating } from '@whosaidtrue/validation';
import { Request, Response, Router } from 'express';
import { logError } from '@whosaidtrue/logger';
import { passport } from '@whosaidtrue/middleware';
import { TokenPayload, CheckRatingResponse } from '@whosaidtrue/api-interfaces';
import { questionRatings, appRatings } from '../../db';

const router = Router();

router.get('/question', [...idQuery], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const questionId = Number(req.query.id);

    try {
        const { rowCount } = await questionRatings.getByUserId(id, questionId);

        if (rowCount) {
            res.status(200).json({ hasRated: true });
        } else {
            res.status(200).json({ hasRated: false });
        }

    } catch (e) {
        logError('Error while fetching user question rating', e);
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

router.post(
  '/question',
  [...questionRating],
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  async (req: Request, res: Response) => {
    const { id } = req.user ? (req.user as TokenPayload) : { id: null };
    const { gameToken, questionId, rating } = req.body;

    try {
      const { playerId } = jwt.verify(gameToken, process.env.JWT_SECRET) as {
        playerId: number;
      };
      await questionRatings.submitRating(id, playerId, questionId, rating);
      res.status(201).send();
    } catch (e) {
      logError('Error while submitting user question rating', e);
      res.status(500).send(ERROR_MESSAGES.unexpected);
    }
  }
);

/**
 * Check if a user has rated the app
 */
router.get('/app', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;

    try {
        const { rowCount } = await appRatings.getByUserId(id);

        if (rowCount) {
            res.status(200).json({ hasRated: true } as CheckRatingResponse);
        } else {
            res.status(200).json({ hasRated: false });
        }

    } catch (e) {
        logError('Error while fetching user app rating', e);
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }

})

/**
 * Submit a new rating. Returns 500 is user has already submitted a rating
 */
router.post('/app', [...appRating], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const { rating } = req.body;

    try {
        await appRatings.submitRating(id, rating)
        res.status(201).send();
    } catch (e) {
        logError('Error while submitting user app rating', e);
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

export default router
