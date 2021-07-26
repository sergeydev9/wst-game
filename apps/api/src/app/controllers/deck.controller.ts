import { NextFunction, Response } from 'express';
import { DeckService } from '../services/deck.service';
import UserService from '../services/users.service';
import { RequestWithUser } from '@whosaidtrue/api-interfaces';
import { DecksAttributes } from '@whosaidtrue/data';
import { User } from '@whosaidtrue/data';

export class DeckController {
  public deckService = new DeckService();
  public userService = new UserService();

  public getDecks = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const decks: DecksAttributes[] = await this.deckService.findAllDecks();
      const response = {
        allDecks: decks,
      };
      if (req.user) {
        const user: User = await this.userService.findUserDecks(1);
        if (user && user['decks']) {
          response['userDecks'] = user['decks'];
        }
      }
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  };
}
