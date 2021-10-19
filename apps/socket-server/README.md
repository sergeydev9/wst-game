# WhoSaidTrue Socket Server

The Socket Server is responsible for real-time communication between the players and 
the game server over Websockets.


## Envirnment Variables

The api reads from the following env variables:

- NODE_ENV
- POSTGRES_DB
- POSTGRES_HOST
- POSTGRES_USER
- POSTGRES_PASSWORD
- JWT_SECRET
- SOCKET_PORT
- REDIS_HOST
- DOMAIN

**warning** Values for DB credentials in `.local.env` must match values in `docker-compose.yml`


## Development Server

Run `nx serve socket-server`

Connect to `http://localhost:4001/socket.io`


## Debugging

To debug the Socket.io messages you can use https://amritb.github.io/socketio-client-tool.

For CORS set `DOMAIN=https://amritb.github.io/` in your env file.
Also you will need to generate a valid JWT token from the API.

Example config:

```json
{
  "path": "/socket.io", 
  "forceNew": true, 
  "reconnectionAttempts": 3, 
  "timeout": 2000,
  "auth": {
    "token": "JWT_TOKEN"
  }
}
```
