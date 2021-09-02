import {EventEmitter} from "events";
import Game from "./game";

class Player extends EventEmitter {
  public readonly playerId: number;
  public readonly game: Game;
  public name?: string;

  public constructor(playerId: number, game: Game) {
    super();
    this.playerId = playerId;
    this.game = game;
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