# WhoSaidTrue Socket Server

The Socket Server is responsible for real-time communication between the players and 
the game server over Websockets.

## Development server

Run `nx serve nx serve socket-server`

Connect to `ws://127.0.0.1:4001/game/:code/player/:guid`

## Websocket messages

The websocket messages have the following structure

```json
{
	"event": "string",
	"success": "boolean",
	"message": "string",
	"data" : {
		"//any" : "//any"
	}
}
```



### Server messages

Message events sent by the server.  

On successful connection the first message sent by the server will be `GameConnected`.

- GameConnected
- PlayerLeft
- PlayerJoinedGame
- ReadQuestion
- ListenQuestion
- AnswerQuestion
- QuestionAnswered
- QuestionResults
- PlayerScores
- FinalScores

For the full message examples see *Debugging* section. In the future this will be updated with complete examples.


### Client messages

Message examples the client (player) can send

```json
{
  "event": "HostJoinGame",
  "data": {
    "playerName": "Alice"
  }
}
```

```json
{
  "event": "PlayerJoinGame",
  "data": {
    "playerName": "Bob"
  }
}
```

```json
{
  "event": "ShowQuestion"
}
```

```json
{
  "event": "QuestionRead"
}
```

```json
{
  "event": "PlayerAnswer",
  "data": {
    "questionNumber": 1,
    "answer": true,
    "guess": 0.5
  }
}
```

```json
{
  "event": "ShowPlayerScores"
}
```

```json
{
  "event": "ForceShowResults"
}
```

## Debugging

To debug the Websocket messages you can use https://websocketking.com.

To ensure everything is running connect to `ws://127.0.0.1:4001:/game/echo` and send any message.

To test game logic connect to `ws://127.0.0.1:4001/game/AAAA/player/1234` and send some 
messages from the *Client messages* section above.  You can use multiple connections to 
test multi-player communication
