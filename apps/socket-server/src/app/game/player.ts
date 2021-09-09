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
    return this.game.hostRow.id == this.playerId;
  }

  public getAnswer(questionNumber: number)
  {
    const q = this.game.getQuestion(questionNumber);

    let answer = q.answers.find(a => a.player.playerId == this.playerId);

    if (!answer) {
      answer = {player: this, state: 'part-1'};
      q.answers.push(answer);
    }

    return answer;
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