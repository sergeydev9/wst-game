# Client Side React Frontend

This is a client side rendered React application.

## Environment Variables

This application requires the following variables to be specified at build time:

- NX_API_BASEURL
- NX_SOCKET_URL
- NX_STRIPE_KEY
- NX_PAYPAL_CLIENT_ID

## Building for production

To build this application for production, run `NODE_ENV=production nx build csr-frontend --prod`. If NODE_ENV is not correctly specified,
 the styles will not be purged, and ~7MB of unused css will be included in the bundle.
