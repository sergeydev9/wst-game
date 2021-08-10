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

  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = await this.gameService.createGame(req.params.code);

      res.status(201).json({ game: { code: game.code }, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public connectGameWs = async (ws: WebSocket, req: Request, next: NextFunction) => {
    try {
      const gameCode = req.params.code;
      const playerId = req.params.guid
      console.log(`connectGameWs gameCode: ${gameCode}, playerId: ${playerId}`);

      this.websocketService.handle(ws, gameCode, playerId);
    } catch (error) {
      next(error);
    }
  };
}

export default GameController;
