/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from 'express';
import GameController from '../controllers/game.controller';

class GameRoute {
  public path = '/game';
  public router = Router();
  public gameController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.ws(`${this.path}/echo`, this.gameController.echo);

    // @ts-ignore
    this.router.ws(`${this.path}/:pin`, this.gameController.connectGameWs);

    this.router.post(`${this.path}/:pin`, this.gameController.createGame);
  }
}

export default GameRoute;