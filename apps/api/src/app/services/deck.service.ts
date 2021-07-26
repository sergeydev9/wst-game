import DB from '@databases';
import { DecksAttributes } from '@models/deck';

export class DeckService {
  decks = DB.Decks;

  public async findAllDecks(): Promise<DecksAttributes[]> {
    return this.decks.findAll();
  }
}
