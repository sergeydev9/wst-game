import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { idQuery, appRating, questionRating } from '@whosaidtrue/validation';
import { Request, Response, Router } from 'express';
import { logger, logError } from '@whosaidtrue/logger';
import { passport } from '@whosaidtrue/middleware';
import { TokenPayload } from '@whosaidtrue/api-interfaces';
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

router.post('/question', [...questionRating], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const { questionId, rating } = req.body;
    try {
        await questionRatings.submitRating(id, questionId, rating);
        res.status(201).send();
    } catch (e) {
        logError('Error while submitting user question rating', e);
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


router.get('/app', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;

    try {
        const { rowCount } = await appRatings.getByUserId(id);

        if (rowCount) {
            res.status(200).json({ hasRated: true });
        } else {
            res.status(200).json({ hasRated: false });
        }

    } catch (e) {
        logError('Error while fetching user app rating', e);
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }

})

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