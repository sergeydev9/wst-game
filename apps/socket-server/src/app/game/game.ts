import {EventEmitter} from "events";
import Player, {GameStatus} from "./player";
import {DeckRow, GamePlayerRow, GameRow, QuestionRow} from "@whosaidtrue/data";

type GameQuestion = {
  questionRow: QuestionRow;
  reader?: Player;
  players: Player[];
  answers: {
    player: Player;
    answer?: 'true' | 'false' | 'pass';
    guess?: number;
  }[];
};

class Game extends EventEmitter {
  public readonly gameRow: GameRow;
  public readonly hostRow: GamePlayerRow;
  public readonly deckRow: DeckRow;

  public readonly players: Player[] = [];

  public host: Player;

  public questionNumber = 0;
  public readonly questions: GameQuestion[] = [];

  public reader: Player;
  public readonly readerOrder: Player[] = [];

  constructor(game: GameRow, host: GamePlayerRow, deck: DeckRow, questions: QuestionRow[]) {
    super();
    this.gameRow = game;
    this.hostRow = host;
    this.deckRow = deck;

    questions.forEach(q => {
      const gameQuestion: GameQuestion = {
        questionRow: q,
        reader: null,
        players: [],
        answers: []
      };
      this.questions.push(gameQuestion);
    });
  }

  public getPlayers(status?: GameStatus) {
    if (status) {
      this.getConnectedPlayers().filter(p => p.gameStatus === status);
    }
    return this.getConnectedPlayers();
  }

  private getConnectedPlayers() {
    return this.players.filter(p => p.clientStatus === 'connected');
  }

  public notifyAll(message: any) {
    this.getPlayers().forEach(p => p.notify(message));
  }

  public notifyWaiting(message: any) {
    this.getPlayers('waiting')
        .forEach(p => p.notify(message));
  }

  public notifyPlaying(message: any) {
    this.getPlayers('playing')
        .forEach(p => p.notify(message));
  }

  public joinWaitingRoom(player: Player) {
    if (!this.checkName(player)) {
      throw new Error(`Sorry! The name '${player.name}' is already taken, game: ${this.gameRow.access_code}`);
    }

    if (player.clientStatus !== 'connected') {
      throw new Error('Not connected, game: ' + this.gameRow.access_code);
    }

    if (!this.players.includes(player)) {
      throw new Error('Not in game: ' + this.gameRow.access_code);
    }

    if (player.gameStatus === 'waiting') {
      throw new Error('Already in waiting room, game: ' + this.gameRow.access_code);
    }

    if (!player.name) {
      throw new Error('Please pick a name, game: ' + this.gameRow.access_code);
    }

    player.gameStatus = 'waiting';
    this.readerOrder.push(player);
  }

  public checkName(player: Player) {
    return !this.players
        .filter(p => p != player)
        .map(p => p.name)
        .includes(player.name);
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
    this.getPlayers('waiting').forEach(p => p.gameStatus = 'playing');

    this.questionNumber++;
    const nextQuestion = this.getQuestion(this.questionNumber);
    nextQuestion.reader = this.readerForQuestion(this.questionNumber);
    nextQuestion.players = [...this.getPlayers('playing')];

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
      followUp: q.questionRow.follow_up,
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