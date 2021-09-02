import {EventEmitter} from "events";
import Game from "./game";

export type GameStatus = 'new' | 'waiting' | 'playing';

class Player extends EventEmitter {
  public name?: string;

  public clientStatus: 'connected' | 'disconnected' = 'disconnected';
  public gameStatus: GameStatus = 'new';

  public constructor(
      public readonly playerId: number,
      public readonly game: Game) {
    super();
  }

  public isHost() {
    return this.game.deckRow.id == this.playerId;
  }

  public requireHost() {
    if (!this.isHost()) {
      throw new Error("You need to be a host to perform this action.")
    }
  }

  public currentScore() {
    // TODO: implement score
    return {
      place: 1,
      points: 500,
    };
  }

  public notify(message: any) {
    this.emit('message', message);
  }
}

export default Player;