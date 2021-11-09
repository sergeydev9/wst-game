# Client Side React Frontend

This is a client side rendered React application.

## Environment Variables

This application requires the following variables to be specified at build time:

- NX_API_BASEURL
- NX_SOCKET_BASEURL
- NX_SOCKET_URL
- NX_STRIPE_KEY
- NX_PAYPAL_CLIENT_ID

## Building for production

To build this application for production, run `NODE_ENV=production nx build csr-frontend --prod`. If NODE_ENV is not correctly specified,
the styles will not be purged, and ~7MB of unused css will be included in the bundle.

## Compression

When building for production, gz, and br compressed versions of all html, css, js, and svg files will be produced.

The server must be configured to prefer serving br, if br isn't supported by the requesting browser it should serve gz, and if gz isn't supported, then the original file should be served.

File names for compressed files follow the rule `[filename][extension].gz` for gzipped files, and `[filename][extension].br` for brotli compressed files.

## Gameplay

All event listeners are defined in the `SocketProvider` component. This component can be found in `src/features/socket/SocketProvider.tsx`.

Any component that needs to send messages to the game server can access the socket connection by using the `useSocket` hook. This is defined in `src/features/socket/useSocket.tsx`

### Events

The following events are emitted by players during gameplay:

## Tests

To launch cypress tests, run `"test:csr-frontend"`.

WARNING: cypress won't be able to start if webpack is currently servint the app at localhost:4200.
