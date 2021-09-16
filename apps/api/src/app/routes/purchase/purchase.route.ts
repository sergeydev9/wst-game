import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { deckId } from '@whosaidtrue/validation';
import { passport } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, } from '@whosaidtrue/util';
import { logger } from '@whosaidtrue/logger';
import { decks, orders } from '../../db';
import { BuyWithCreditsRequest, TokenPayload } from '@whosaidtrue/api-interfaces';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    maxNetworkRetries: 1,

});

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

router.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodType, currency, deckId } = req.body;
    let price: number;

    try {
        const { rows } = await decks.getById(deckId)

        price = parseFloat(rows[0].purchase_price.replace(/[^0-9]/g, ""))
    } catch (e) {
        logger.error(e);
        res.status(500).send('Could not find deck with specified ID.')
    }

    const params = {
        payment_method_types: [paymentMethodType],
        amount: price,
        currency: currency,
    }


    // Create a PaymentIntent with the amount, currency, and a payment method type.
    //
    // See the documentation [0] for the full list of supported parameters.
    //
    // [0] https://stripe.com/docs/api/payment_intents/create
    try {
        const paymentIntent = await stripe.paymentIntents.create(params);

        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
});

export default router;