# API

The api app requires a running database. Start up postgres by running `docker compose up`. Once the database is up and running, start the api server by running `nx serve api`.

## Envirnment Variables

The api reads from the following env variables:

- POSTGRES_DB
- POSTGRES_HOST
- POSTGRES_USER
- POSTGRES_PASSWORD
- JWT_SECRET
- NODE_ENV
- PORT
- STRIPE_SECRET_KEY
- DOMAIN
- SG_API_KEY
- STRIPE_WEBHOOK_SECRET
- PAYPAL_CLIENT_SECRET
- FOR_SCHOOLS_DOMAIN
- EMAIL_RECIPIENT

**warning** Values for DB credentials in `.local.env` must match values in `docker-compose.yml`

## Payment Processor Keys

Stripe and PayPal keys are not - and should never be - stored in the repository. These values must be entered manually in your `.local.env`. be careful never to commit them.

## Stripe

The api connects to, and receives messages from, Stripe. In order to test the Stripe integration locally, you must follow these steps:

- Ensure you are accessing the front end application over https.
- If you want to test Apple Pay or Google Pay, save a credit card to your browser. The Apple Pay/Google Pay button will only load on a browser where Apple Pay/Google Pay is enabled.
- Install the stripe cli and use it to log in to your account. [instructions here](https://stripe.com/docs/stripe-cli)
- Once logged in, forward webhook events to the WST api by running the following: `stripe listen --forward-to localhost:3000/purchase/webhook`

Once these steps are complete, you can then make purchases in local dev, trigger webhook events to test them, and run custom event fixtures like the one in
`./src/app/routes/purchase/test.webhook.fixture.json`

### Test Cards

Stripe provides a number of test credit card numbers that can be used to test different scenarios/vendors. You can make purchases using `4242424242424242` with any 3 digit CVC, and any future date as expiry. This will lead to a successful Visa purchase.

For more test cards, see the Stripe [docs](https://stripe.com/docs/testing).

### Webhook

User deck records are created for users when the API receives a purchase success event via the webhook listener.

If a user deck record is successfully created, the API gives Stripe a success notification.

If Stripe does not receive a success response to a webhook event, it will repeatedly retry the request for up to 3 days. Failed webhook requests can be seen on the Stripe dashboard.

Once properly configured, it is exteremely unlikely that an event will fail to be registered by the listener for all retry attempts. The api and database would have to go offline within a very short time window, and they would have to stay that way for 3 days.

However, if that does ever happen, then it means that the user bought a deck, but it was never added to their collection. A refund should be initialized from the Stripe dashboard.

## Paypal

In order to be able to test Paypal locally, enter the test credentials for the Paypal developer sandbox account in the relevant environment variables. DO NOT USE THE PRODUCTION KEYS. Once this is done, you can make Paypal purchases using the personal sandbox account asoociated with the sandbox application. Be sure to use the personal, not the business accounts, as only the personal account will be able to make purchases on the test key.

### testing paypal failures

In order to test failed payments on Paypal, custom headers must be attached to outgoing requests. One of these remains commented out in the paypal endpoint in the purchase route. Headers must be manually added and removed from the api in order to test the integration. However, be sure to comment/remove them after tests are done.

### node SDK documentation

As a general rule, the documentation for PayPal's server side Node SDK is not to be trusted. Its behavior is often radically different than what is in the examples, and objects do not always have the interface that is documented. Long story short, test everything, trust nothing.
