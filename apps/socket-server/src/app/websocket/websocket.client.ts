import {EventEmitter} from "events";
import * as WebSocket from 'ws';
import * as uuid from 'uuid';
import GameService from "../services/game.service";
import {AnswerPart1, HostJoinGame, PlayerJoinGame, WebsocketError, WebsocketMessage} from '@whosaidtrue/api-interfaces'
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
      const msg: WebsocketError = {event: 'WebsocketError', status: 'fail', payload: {errorMessage: e.message}};
      this.sendMessage(msg);
      return;
    }

    try {
      const game = this.player.game;

      switch (message.event) {
        case 'HostJoinGame': // -> HostJoinedGame

          this.gameService.hostJoinGame(game, this.player, (message as HostJoinGame).payload.playerName);
          break;

        case 'PlayerJoinGame': // -> PlayerJoinedGame

          this.gameService.playerJoinGame(game, this.player, (message as PlayerJoinGame).payload.playerName);
          break;

        case 'NextQuestion': // -> QuestionPart1 | FinalScores

          if (this.player.game.isFinalQuestion()) {
            this.gameService.showFinalScores(game, this.player);
          } else {
            this.gameService.nextQuestion(game, this.player);
          }
          break;

        case 'AnswerPart1': // -> QuestionPart2

          this.gameService.playerAnswerPart1(game, this.player, message.payload);
          break;

        case 'AnswerPart2': // -> PlayerAnswered, QuestionResults

          this.gameService.playerAnswerPart2(game, this.player, message.payload);
          break;

        case 'ShowResults': // -> QuestionResults

          this.gameService.forceShowResults(game, this.player);
          break;

        case 'ShowScores': // -> QuestionScores

          this.gameService.showScores(game, this.player);
          break;

        case 'ShowFinalScores': // -> FinalScores

          this.gameService.showFinalScores(game, this.player);
          break;

        default:
          throw new Error('Unhandled message: ' + JSON.stringify(message));
      }

      // TODO: message ids for ack?
      // ack
      this.sendMessage({event: message.event, status: 'ok'});
    } catch (e) {
      console.error(e);
      const msg: WebsocketError = {event: message.event, status: 'fail', payload: {errorMessage: e.message}};
      this.sendMessage(msg);
    }
  };

}

export default WebsocketClient;
