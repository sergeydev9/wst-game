import { Router, Request, Response } from 'express';
import { deckId } from '@whosaidtrue/validation';
import { passport } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, } from '@whosaidtrue/util';
import { logger } from '@whosaidtrue/logger';
import { orders } from '../../db';
import { BuyWithCreditsRequest, TokenPayload } from '@whosaidtrue/api-interfaces';

const router = Router();

router.post('/credits', [...deckId], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { deckId } = req.body as BuyWithCreditsRequest;
    const { id } = req.user as TokenPayload; // user id form token

    try {
        const result = await orders.purchaseWithCredits(id, deckId);

        if (!result) {
            res.status(400).send('Unable to redeem credits for that user.')
        } else {
            res.status(201).send('Free deck credits successfully redeemed')
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

export default router;