# WhoSaidTrue Socket Server

The Socket Server is responsible for real-time communication between the players and 
the game server over Websockets.

## Development Server

Run `nx serve socket-server`

Connect to `ws://127.0.0.1:4001/game/:code/player/:guid`

## Websocket Messages

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

To debug the Websocket messages you can use https://websocketking.com.

To ensure everything is running connect to `ws://127.0.0.1:4001:/game/echo` and send any message.

To test game logic connect to `ws://127.0.0.1:4001/game/AAAA/player/1234` and send some 
messages from the *Client messages* section above.  You can use multiple connections to 
test multi-player communication
