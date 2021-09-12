# WhoSaidTrue Socket Server

The Socket Server is responsible for real-time communication between the players and 
the game server over Websockets.

## Development Server

Run `nx serve socket-server`

Connect to `http://localhost:4001/socket.io`


## Messages Structure

The websocket message types are defined in libs/api-interfaces/src/lib/ws-interfaces.ts

The top-level message structure is
````json
{
	"event": "string",
	"status": "string",
	"debut": "string",
	"payload" : {
		"string" : "//any"
	}
}
````


### Server Messages

Messages sent by the server to the players. 

On successful connection the first message sent by the server will be `GameConnected`.

*Server Messages*
- GameConnected
- HostJoinedGame
- PlayerJoinedGame
- PlayerLeftGame
- QuestionPart1
- QuestionPart2
- PlayerAnswered
- QuestionResults
- QuestionScores
- FinalScores


### Client Messages

Messages sent by the players to the server.

On successful connection the first message should be `PlayerJoinGame` or `HostJoinGame`.

*Player messages*
- PlayerJoinGame
- AnswerPart1
- AnswerPart2

*Host only messages*
- HostJoinGame
- NextQuestion
- ShowResults
- ShowScores
- ShowFinalScores


## Debugging

To debug the Socket.io messages you can use https://amritb.github.io/socketio-client-tool.

Example config:

```json
{
  "path": "/socket.io", 
  "forceNew": true, 
  "reconnectionAttempts": 3, 
  "timeout": 2000,
  "auth": {
    "token": "$JWT_TOKEN"
  }
}
```
