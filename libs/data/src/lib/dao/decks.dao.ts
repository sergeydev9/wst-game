import Dao from './base.dao';
import { Deck } from '../interfaces';

class Decks extends Dao<Deck> {

    getUserDecks = async (userId: string) => {
        const { rows } = await this.pool.query(`SELECT * from get_user_decks(${userId})`); // call function in DB
        return rows
    }

}

export default Decks;