import { Router, Request, Response, raw, json } from 'express';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { deckId } from '@whosaidtrue/validation';
import { passport } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, } from '@whosaidtrue/util';
import { logger } from '@whosaidtrue/logger';
import { decks, orders } from '../../db';
import { BuyWithCreditsRequest, TokenPayload } from '@whosaidtrue/api-interfaces';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    maxNetworkRetries: 2,
});

/**
 * Buy with free deck credits.
 */
router.post('/credits', [json(), ...deckId], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
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


/**
 * Create a Stripe payment intent.
 */
router.post('/create-payment-intent', [json(), ...deckId], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { deckId } = req.body;
    const { id } = req.user as TokenPayload; // user id form token

    let price: number;

    try {
        const { rows } = await decks.getById(deckId)
        price = parseFloat(rows[0].purchase_price.replace(/[^0-9]/g, ""))
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Could not find deck with specified ID.')
    }

    const params = {
        amount: price,
        payment_method_types: ['card'],
        currency: 'usd',
        metadata: {
            user_id: id,
            deck_id: deckId
        }
    }

    try {
        // use idempotencyKey to prevent request duplication.
        const paymentIntent = await stripe.paymentIntents.create(params, { idempotencyKey: uuidv4(), apiKey: process.env.STRIPE_SECRET_KEY });

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

/**
 * When a payment is successful, Stripe sends a notification here.
 * This endpoint  listens for messags from stripe and creates user_deck records
 * in response to sucessful payment events.
 */
router.post('/webhook', raw({ type: 'application/json' }), async (req: Request, res: Response) => {

    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'payment_intent.succeeded') {
        try {
            const { user_id, deck_id } = event.data.object.metadata;
            const result = await orders.completeStripeOrder(user_id, deck_id, event.data.object)
            if (result.rowCount == 1) {
                return res.sendStatus(200)
            }

        } catch (e) {
            logger.error(`Could not create user_deck and order record. Error: ${e} Object: ${JSON.stringify(event.data.object)}`)
            return res.sendStatus(400)
        }
    }

    res.sendStatus(200);

});

export default router;