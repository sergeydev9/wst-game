import { Router } from 'express';
import { DeckController } from '../controllers/deck.controller';
import authMiddleware from '../auth.middleware';

class DecksRoute {
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
