import { NextFunction, Request, Response } from 'express';
import * as WebSocket from 'ws';
import GameService from '../services/game.service';
import WebsocketService from "../services/websocket.service";

class GameController {
  public gameService = new GameService();
  public websocketService = new WebsocketService(this.gameService);

  public echo = (ws: WebSocket, req: Request, next: NextFunction) => {
    try {
      ws.on('message', function (msg) {
        ws.send(msg);
      });
    } catch (error) {
      ws.terminate();
      next(error);
    }
  };

  public joinGameWs = async (ws: WebSocket, req: Request, next: NextFunction) => {
    try {
      const gameCode = req.params.code;
      const playerId = parseInt(req.params.guid);
      console.log(`joinGameWs gameCode: ${gameCode}, playerId: ${playerId}`);

      this.websocketService.handle(ws, gameCode, playerId);
    } catch (error) {
      next(error);
    }
  };
}

export default GameController;
