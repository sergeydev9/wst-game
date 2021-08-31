/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from 'express';
import GameController from '../controllers/game.controller';

class GameRoute {
  public router = Router();
  public gameController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.ws('/game/echo', this.gameController.echo);

    // @ts-ignore
    this.router.ws('/game/:code/player/:guid', this.gameController.joinGameWs);

    this.router.post('/game/create', this.gameController.createGame);
  }
}

export default GameRoute;