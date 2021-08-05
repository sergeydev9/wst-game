import {EventEmitter} from "events";
import Game from "./game";

class Player extends EventEmitter {
  public readonly playerId: string;
  public readonly game: Game;
  public name?: string;

  public constructor(playerId: string, game: Game) {
    super();
    this.playerId = playerId;
    this.game = game;
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