import {EventEmitter} from "events";
import Player from "./player";

type Question = {
  text: string;
  type: string;
  answers?: {
    player: Player;
    answer: boolean;
    guess: number;
  }[];
};

type Deck = {
  name: string;
  questions: Question[];
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
  public readonly questions: Question[] = [];
  public readonly questionsLength: number;

  public reader: Player;
  public readonly readerOrder: Player[] = [];

  constructor(code: string, deck: Deck) {
    super();
    this.code = code;
    this.deck = deck;

    deck.questions.forEach(q => {
      q.answers = [];
      this.questions.push(q);
    });
    this.questionsLength = this.questions.length;
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
    if (question < 1 || question > this.questionsLength) {
      throw new Error(`Invalid question ${question}, valid: 1-${this.questionsLength}`);
    }

    return this.questions[question - 1];
  }

  public currentQuestion(): Question {
    if (this.questionNumber < 1 || this.questionNumber > this.questionsLength) {
      return null;
    }

    return this.questions[this.questionNumber - 1];
  }

  public nextQuestion() {
    if (this.questionNumber >= this.questionsLength) {
      return null;
    }

    // move all players from waiting room to active
    this.active.push(...this.waiting);
    this.waiting.splice(0, this.waiting.length);

    this.questionNumber++;
    this.reader = this.readerForQuestion(this.questionNumber);
    return this.currentQuestion();
  }

  public isFinalQuestion() {
    return this.questionNumber == this.questionsLength;
  }

  public currentResults() {
    return this.questionResults(this.questionNumber);
  }

  public questionResults(question: number) {
    if (question < 1 || question > this.questionsLength) {
      throw new Error(`Invalid question ${question}, valid: 1-${this.questionsLength}`);
    }

    const q = this.questions[question - 1];

    return {
      groupTotalCount: q.answers.length,
      groupTrueCount: q.answers.filter(a => a.answer).length,
      followUp: 'What was the show?', // TODO
      groupPercent: 1, // TODO
      everyonePercent: 0.5, // TODO
    };
  }

  public currentScores() {
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