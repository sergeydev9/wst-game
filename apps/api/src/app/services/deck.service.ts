import DB from '../db';
import { DecksAttributes } from '@whosaidtrue/data';

export class DeckService {
  decks = DB.Decks;

  public async findAllDecks(): Promise<DecksAttributes[]> {
    return this.decks.findAll();
  }
}
