import * as WebSocket from 'ws';
import GameService from "./game.service";
import WebsocketClient from "../websocket/websocket.client";

class WebsocketService {

  public readonly clients: { [key: string]: WebsocketClient } = {};
  private readonly gameService: GameService;

  public constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  public async handle(ws: WebSocket, gameCode: string, playerId: number) {
    try {
      console.log("WebsocketService.handle");

      const player = await this.gameService.connectPlayer(playerId, gameCode);
      const client = new WebsocketClient(ws, player, this.gameService);

      client.on('close', () => this.onDisconnected(client));

      this.onConnected(client);

      ws.send(JSON.stringify({
        event: 'GameConnected',
        success: true,
        message: 'Welcome! Please pick a name.',
        data: {gameCode: player.game.gameRow.access_code, playerId: playerId}
      }));
    } catch (e) {
      console.error(e);
      ws.send(JSON.stringify({
        event: 'GameConnected',
        success: false,
        message: e.message,
        data: {gameCode: gameCode, playerId: playerId}
      }));
      ws.terminate();

      // handle error at websocket level and propagate to caller to handle rest
      throw e;
    }
  };

  private onConnected(client: WebsocketClient) {

    if (this.clients[client.clientId]) {
      throw new Error(`client ${client.clientId} already exists`);
    }

    this.clients[client.clientId] = client;
  }

  private onDisconnected(client: WebsocketClient) {
    if (this.clients[client.clientId]) {
      delete this.clients[client.clientId];
    }
  }

}

export default WebsocketService;
