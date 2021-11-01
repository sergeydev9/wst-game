import { DatabaseError, Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import Orders from './Orders.dao';
import Users from '../users/Users.dao';
import Decks from '../decks/decks.dao';
import { setupOneDeck } from '../util/testDependencySetup';

describe('Orders', () => {
    let pool: Pool;
    let orders: Orders;
    let decks: Decks;
    let users: Users;
    let userId: number;
    let deckId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION)
        orders = new Orders(pool)
        users = new Users(pool)
        decks = new Decks(pool)
    })

    beforeEach(async () => {
        await cleanDb(pool)
    })

    afterAll(() => {
        pool.end()
    })

    describe('completeOrder', () => {
        const validPaymentIntent = {
            id: "pi_3JZhbMLD70ppdWl614iyCiYE",
            object: "payment_intent",
            allowed_source_types: [
                "card"
            ],
            amount: 2000,
            amount_capturable: 0,
            amount_received: 2000,
            application: null,
            application_fee_amount: null,
            canceled_at: null,
            cancellation_reason: null,
            capture_method: "automatic",
            charges: {
                "object": "list",
                "data": [
                    {
                        "id": "ch_3JZhbMLD70ppdWl61AoRjEIR",
                        "object": "charge",
                        "amount": 2000,
                        "amount_captured": 2000,
                        "amount_refunded": 0,
                        "application": null,
                        "application_fee": null,
                        "application_fee_amount": null,
                        "balance_transaction": "txn_3JZhbMLD70ppdWl61c9ETYiS",
                        "billing_details": {
                            "address": {
                                "city": null,
                                "country": null,
                                "line1": null,
                                "line2": null,
                                "postal_code": null,
                                "state": null
                            },
                            "email": null,
                            "name": null,
                            "phone": null
                        },
                        "calculated_statement_descriptor": "Stripe",
                        "captured": true,
                        "created": 1631648852,
                        "currency": "usd",
                        "customer": null,
                        "description": "(created by Stripe CLI)",
                        "destination": null,
                        "dispute": null,
                        "disputed": false,
                        "failure_code": null,
                        "failure_message": null,
                        "fraud_details": {},
                        "invoice": null,
                        "livemode": false,
                        "metadata": {},
                        "on_behalf_of": null,
                        "order": null,
                        "outcome": {
                            "network_status": "approved_by_network",
                            "reason": null,
                            "risk_level": "normal",
                            "risk_score": 22,
                            "seller_message": "Payment complete.",
                            "type": "authorized"
                        },
                        "paid": true,
                        "payment_intent": "pi_3JZhbMLD70ppdWl614iyCiYE",
                        "payment_method": "pm_1JZhbMLD70ppdWl64BEikxgr",
                        "payment_method_details": {
                            "card": {
                                "brand": "visa",
                                "checks": {
                                    "address_line1_check": null,
                                    "address_postal_code_check": null,
                                    "cvc_check": null
                                },
                                "country": "US",
                                "exp_month": 9,
                                "exp_year": 2022,
                                "fingerprint": "rMDF9uoDiKBMScbk",
                                "funding": "credit",
                                "installments": null,
                                "last4": "4242",
                                "network": "visa",
                                "three_d_secure": null,
                                "wallet": null
                            },
                            "type": "card"
                        },
                        "receipt_email": null,
                        "receipt_number": null,
                        "receipt_url": "https://pay.stripe.com/receipts/acct_1B2KeULD70ppdWl6/ch_3JZhbMLD70ppdWl61AoRjEIR/rcpt_KE9v5JKw39uSp23k18fpBrUnSdH33zv",
                        "refunded": false,
                        "refunds": {
                            "object": "list",
                            "data": [],
                            "has_more": false,
                            "total_count": 0,
                            "url": "/v1/charges/ch_3JZhbMLD70ppdWl61AoRjEIR/refunds"
                        },
                        "review": null,
                        "shipping": {
                            "address": {
                                "city": "San Francisco",
                                "country": "US",
                                "line1": "510 Townsend St",
                                "line2": null,
                                "postal_code": "94103",
                                "state": "CA"
                            },
                            "carrier": null,
                            "name": "Jenny Rosen",
                            "phone": null,
                            "tracking_number": null
                        },
                        "source": null,
                        "source_transfer": null,
                        "statement_descriptor": null,
                        "statement_descriptor_suffix": null,
                        "status": "succeeded",
                        "transfer_data": null,
                        "transfer_group": null
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/charges?payment_intent=pi_3JZhbMLD70ppdWl614iyCiYE"
            },
            client_secret: "pi_3JZhbMLD70ppdWl614iyCiYE_secret_6LPfpKaoQTYVmPNiJIiotKGjh",
            confirmation_method: "automatic",
            created: 1631648852,
            currency: "usd",
            customer: null,
            description: "(created by Stripe CLI)",
            invoice: null,
            last_payment_error: null,
            livemode: false,
            metadata: {},
            next_action: null,
            next_source_action: null,
            on_behalf_of: null,
            payment_method: "pm_1JZhbMLD70ppdWl64BEikxgr",
            payment_method_options: {
                "card": {
                    "installments": null,
                    "network": null,
                    "request_three_d_secure": "automatic"
                }
            },
            payment_method_types: [
                "card"
            ],
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: {
                "address": {
                    "city": "San Francisco",
                    "country": "US",
                    "line1": "510 Townsend St",
                    "line2": null,
                    "postal_code": "94103",
                    "state": "CA"
                },
                "carrier": null,
                "name": "Jenny Rosen",
                "phone": null,
                "tracking_number": null
            },
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: "succeeded",
            transfer_data: null,
            transfer_group: null,
        }

        let deckId: number, userId: number;

        beforeEach(async () => {
            deckId = await setupOneDeck(pool)
            const { rows } = await users.register('email@test.com', 'password123')
            userId = rows[0].id
        })

        it('should have rowCount 1 if successful', async () => {
            const { rowCount } = await orders.completeOrder(userId, deckId, validPaymentIntent)

            expect(rowCount).toEqual(1)
        })

    })

    describe('purchaseWithCredits', () => {

        beforeEach(async () => {
            deckId = await setupOneDeck(pool)
            const { rows } = await users.register('email@test.com', 'password123')
            userId = rows[0].id
        })
        it('should return a user_id if successful', async () => {
            await users.setCredits(userId, 5)
            const result = await orders.purchaseWithCredits(userId, deckId)
            expect(result).toEqual(userId)
        })

        it('should return undefined if user has no credits', async () => {
            const result = await orders.purchaseWithCredits(userId, deckId)
            expect(result).not.toBeDefined()
        })

        it('should create a user_deck record if successful', async () => {
            await users.setCredits(userId, 5)
            await orders.purchaseWithCredits(userId, deckId)
            const { rows } = await decks.getUserDecks(userId);

            expect(rows.filter(el => el.id === deckId).length).toEqual(1)
        })

        it("should throw if deck doesn't exist", async () => {
            await users.setCredits(userId, 5)
            try {
                await orders.purchaseWithCredits(userId, 0)
                fail()
            } catch (e) {
                expect(e).toEqual(new DatabaseError('insert or update on table "orders" violates foreign key constraint "orders_deck_id_fkey"', 1, 'error'))
            }
        })
    })
})