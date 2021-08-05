import {EventEmitter} from "events";
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import GameService from "../services/game.service";
import WebsocketMessage from "./websocket.message";
import Game from "../game/game";
import Player from "../game/player";


class WebsocketClient extends EventEmitter {

  public readonly clientId: string;
  public readonly player: Player;
  public readonly game: Game;

  private readonly ws: WebSocket;
  private readonly gameService: GameService;

  public constructor(ws: WebSocket, player: Player, gameService: GameService) {
    super();

    this.clientId = uuid.v4();
    this.ws = ws;
    this.player = player;
    this.gameService = gameService;

    this.player.on('message', message => {
      console.debug('player message', message);
      this.sendMessage(message);
    });

    ws.on('message', data => {
      console.debug('ws message', data);
      this.handleMessage(data);
    });

    ws.on('close', (code, reason) => {
      console.warn('ws close', code, reason);
      this.gameService.disconnectPlayer(this.player);
      this.emit('close');
    });

    ws.on('error', e => {
      console.error('ws error', e);
    });

    ws.on('open', () => {
      console.debug('ws open');
    });

    ws.on('ping', data => {
      console.debug('ws ping', data);
    });

    ws.on('pong', data => {
      console.debug('ws pong', data);
    });
  }

  private sendMessage = (message: WebsocketMessage) => {
    this.ws.send(JSON.stringify(message));
  };

  private handleMessage = (data: any) => {

    let message: WebsocketMessage;
    try {
      message = JSON.parse(data);
    } catch (e) {
      console.error(e);
      this.sendMessage({event: 'JsonParse', success: false, message: e.message});
      return;
    }

    try {
      const game = this.player.game;
      
      switch (message.event) {
        case 'HostJoinGame':
          this.player.game.host = this.player;
          this.gameService.joinWaitingRoom(this.player.game, this.player, message.data.playerName);
          break;

        case 'PlayerJoinGame': // -> this.playerJoinedGame
          this.gameService.joinWaitingRoom(game, this.player, message.data.playerName);
          break;

        case 'ShowQuestion': // -> ReadQuestion | ListenQuestion, FinalScores
          if(this.player.game.isFinalQuestion()) {
            this.gameService.showFinalScores(game, this.player);
          } else {
            this.gameService.nextQuestion(game, this.player);
          }
          break;

        case 'QuestionRead': // -> AnswerQuestion
          this.gameService.answerQuestion(game, this.player);
          break;

        case 'PlayerAnswer': // -> QuestionAnswered, QuestionResults
          this.gameService.playerAnswer(game, this.player, message.data);
          break;

        case 'ForceShowResults': // -> QuestionResults
          this.gameService.forceShowResults(game, this.player);
          break;

        case 'ShowPlayerScores': // -> this.playerScores
          this.gameService.showScores(game, this.player);
          break;

        default:
          throw new Error('Unhandled message: ' + JSON.stringify(message));
      }

      // TODO: message ids for ack?
      // ack
      this.sendMessage({event: message.event, success: true, message: 'Ok'});

      // response
      // TODO
    } catch (e) {
      console.error(e);
      this.sendMessage({event: message.event, success: false, message: e.message});
    }
  };

}

export default WebsocketClient;
