import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import { DeckController } from '@controllers/deck.controller';
import authMiddleware from '@middlewares/auth.middleware';

class DecksRoute implements Route {
  public path = '/decks';
  public router = Router();
  public deckController = new DeckController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.deckController.getDecks);
  }
}

export default DecksRoute;
