import * as WebSocket from 'ws';
import GameService from "./game.service";
import WebsocketClient from "../websocket/websocket.client";

class WebsocketService {

  public readonly clients: { [key: string]: WebsocketClient } = {};
  private readonly gameService: GameService;

  public constructor (gameService: GameService) {
    this.gameService = gameService;
  }

  public handle (ws: WebSocket, gameCode: string, playerId: string)
  {
    // TODO: switch to gameService.findGame()
    const game = this.gameService.devOnlyFindOrCreateGame(gameCode);

    if (!game) {
      console.warn('invalid game code ', gameCode, playerId);
      ws.send(JSON.stringify({ event: 'ConnectGame', success: false, message: 'Invalid game pin.' }));
      ws.close();
      return;
    }

    const player = this.gameService.createPlayer(playerId, game);
    const client = new WebsocketClient(ws, player, this.gameService);

    client.on('close', () => this.onDisconnected(client));

    this.onConnected(client);
  };

  private onConnected (client: WebsocketClient) {

    if (this.clients[client.clientId]) {
      throw new Error(`client ${client.clientId} already exists`);
    }

    this.clients[client.clientId] = client;
  }

  private onDisconnected (client: WebsocketClient) {
    if (this.clients[client.clientId]) {
      delete this.clients[client.clientId];
    }
  }

}

export default WebsocketService;
