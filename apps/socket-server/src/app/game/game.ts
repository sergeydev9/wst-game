import {EventEmitter} from "events";
import Player from "./player";

// TODO: temp type defs, will probably replace with db models
type GameQuestion = {
  text: string;
  followUp: string;
  type: string;
  reader?: Player;
  players: Player[];
  answers: {
    player: Player;
    answer?: 'true' | 'false' | 'pass';
    guess?: number;
  }[];
};

type DeckQuestion = {
  text: string;
  type: string;
}

type Deck = {
  name: string;
  questions: DeckQuestion[];
};


class Game extends EventEmitter {
  public readonly code: string;
  public readonly deck: Deck;
  public readonly connected: Player[] = [];
  public readonly disconnected: Player[] = [];
  public readonly waiting: Player[] = [];
  public readonly active: Player[] = [];

  public host: Player;

  public questionNumber = 0;
  public readonly questions: GameQuestion[] = [];

  public reader: Player;
  public readonly readerOrder: Player[] = [];

  constructor(code: string, deck: Deck) {
    super();
    this.code = code;
    this.deck = deck;

    deck.questions.forEach(deckQuestion => {
      const gameQuestion: GameQuestion = {
        text: deckQuestion.text,
        followUp: 'What was the show?', // TODO
        type: deckQuestion.type,
        reader: null,
        players: [],
        answers: []
      };
      this.questions.push(gameQuestion);
    });
  }

  public notifyAll(message: any) {
    this.connected.forEach(p => p.notify(message));
  }

  public emitConnected(event: string, message: any) {
    this.connected.forEach(p => p.emit(event, message));
  }

  public notifyWaiting(message: any) {
    this.waiting.forEach(p => p.notify(message));
  }

  public emitWaiting(event: string, message: any) {
    this.waiting.forEach(p => p.emit(event, message));
  }

  public notifyActive(message: any) {
    this.active.forEach(p => p.notify(message));
  }

  public emitActive(event: string, message: any) {
    this.active.forEach(p => p.emit(event, message));
  }

  public joinWaitingRoom(player: Player) {
    if (!this.connected.includes(player)) {
      throw new Error('Not connected, game: ' + this.code);
    }

    if (this.disconnected.includes(player)) {
      throw new Error('Disconnected, game: ' + this.code);
    }

    if (this.waiting.includes(player)) {
      throw new Error('Already in waiting room, game: ' + this.code);
    }

    if (!player.name) {
      throw new Error('Please pick a name, game: ' + this.code);
    }

    this.waiting.push(player);
    this.readerOrder.push(player);

    // remove from active
    const index = this.active.indexOf(player);
    if (index > -1) {
      this.active.splice(index, 1);
    }
  }

  public checkName(name: string) {
    return !this.connected.map(p => p.name).includes(name);
  }

  public getQuestion(question: number) {
    if (question < 1 || question > this.questions.length) {
      throw new Error(`Invalid question ${question}, valid: 1-${this.questions.length}`);
    }

    return this.questions[question - 1];
  }

  public nextQuestion() {
    if (this.questionNumber >= this.questions.length) {
      return null;
    }

    // move all players from waiting room to active
    this.active.push(...this.waiting);
    this.waiting.splice(0, this.waiting.length);

    this.questionNumber++;
    const nextQuestion = this.getQuestion(this.questionNumber);
    nextQuestion.reader = this.readerForQuestion(this.questionNumber);
    nextQuestion.players =  [...this.active];

    return nextQuestion;
  }

  public isFinalQuestion() {
    return this.questionNumber == this.questions.length;
  }

  public questionResults(question: number) {
    if (question < 1 || question > this.questions.length) {
      throw new Error(`Invalid question ${question}, valid: 1-${this.questions.length}`);
    }

    const q = this.questions[question - 1];
    const groupTrueCount = q.answers.filter(a => a.answer === 'true').length;

    return {
      followUp: q.followUp,
      playersCount: q.players.length,
      groupTrueCount: groupTrueCount,
      groupPercent: groupTrueCount / q.players.length,
      globalPercent: 0.5, // TODO: global stats from db
    };
  }

  public currentScore() {
    // TODO: implement scores
    return [
      {
        place: 1,
        playerName: 'Jane the Bin',
        points: 11500,
      },
      {
        place: 2,
        playerName: 'John Doe',
        points: 9430,
      },
      {
        place: 3,
        playerName: 'Exotic Animal',
        points: 9430,
      },
      {
        place: 4,
        playerName: 'Mystic Raccoon',
        points: 8970,
      },
      {
        place: 5,
        playerName: 'Game Name',
        points: 5500,
      },
    ];
  }

  public readerForQuestion(question: number) {
    return this.readerOrder[(question - 1) % this.readerOrder.length];
  }
}

export default Game;