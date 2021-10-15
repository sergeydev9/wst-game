import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { idQuery, appRating, questionRating } from '@whosaidtrue/validation';
import { Request, Response, Router } from 'express';
import { logger } from '@whosaidtrue/logger';
import { passport } from '@whosaidtrue/middleware';

const router = Router();

router.get('/question', [...idQuery], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        // fill
    } catch (e) {
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

router.post('/question', [...questionRating], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        // fill
    } catch (e) {
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


router.get('/app', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        // fill
    } catch (e) {
        logger.error(e)
    }
})

router.post('/app', [...appRating], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        // fill
    } catch (e) {
        logger.error(e)
    }
})

export default router