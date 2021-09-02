import {EventEmitter} from "events";
import Player, {GameStatus} from "./player";

import {
  AnswerValue,
  Deck as IDeck,
  Game as IGame,
  GamePlayer as IGamePlayer,
  Question as IQuestion,
} from '@whosaidtrue/app-interfaces';
import {PlayerScore} from "@whosaidtrue/api-interfaces";

export type GameQuestion = {
  questionRow: IQuestion;
  reader?: Player;
  players: Player[];
  answers: {
    player: Player;
    state: 'part-1' | 'part-2' | 'finished';
    answer?: AnswerValue
    guess?: number;
  }[];
};

class Game extends EventEmitter {
  public readonly gameRow: IGame;
  public readonly hostRow: IGamePlayer;
  public readonly deckRow: IDeck;

  public readonly players: Player[] = [];

  public status: 'lobby' | 'pre-lobby' | 'playing' | 'post-game' | 'finished' | 'error' = 'lobby';
  public host: Player;

  public questionNumber = 0;
  public readonly questions: GameQuestion[] = [];

  public reader: Player;
  public readonly readerOrder: Player[] = [];

  constructor(game: IGame, host: IGamePlayer, deck: IDeck, questions: IQuestion[]) {
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

  public getConnectedPlayers(status?: GameStatus) {
    if (status) {
      this.getConnected().filter(p => p.gameStatus === status);
    }
    return this.getConnected();
  }

  private getConnected() {
    return this.players.filter(p => p.clientStatus === 'connected');
  }

  public notifyAll(message: any) {
    this.getConnectedPlayers().forEach(p => p.notify(message));
  }

  public notifyAllExcept(exclude: Player, message: any) {
    this.getConnectedPlayers()
        .filter(p => p != exclude)
        .forEach(p => p.notify(message));
  }

  public notifyWaiting(message: any) {
    this.getConnectedPlayers('waiting')
        .forEach(p => p.notify(message));
  }

  public notifyPlaying(message: any) {
    this.getConnectedPlayers('playing')
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

  public currentQuestion() {
    return this.getQuestion(this.questionNumber);
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
    this.getConnectedPlayers('waiting').forEach(p => p.gameStatus = 'playing');

    this.questionNumber++;
    const nextQuestion = this.getQuestion(this.questionNumber);
    nextQuestion.reader = this.readerForQuestion(this.questionNumber);
    nextQuestion.players = [...this.getConnectedPlayers('playing')];

    return nextQuestion;
  }

  public isFinalQuestion() {
    return this.questionNumber == this.questions.length;
  }

  public questionResults(questionNumber: number, player: Player) {
    if (questionNumber < 1 || questionNumber > this.questions.length) {
      throw new Error(`Invalid question ${questionNumber}, valid: 1-${this.questions.length}`);
    }

    const question = this.questions[questionNumber - 1];
    const correctAnswer = question.answers.filter(a => a.answer === 'true').length;
    const answer = player.getAnswer(questionNumber);

    return {
      question_number: questionNumber,
      question_total: this.questions.length,

      result: answer.guess,
      result_text: question.questionRow.text_for_guess,
      follow_up_text: question.questionRow.follow_up,

      your_group_percent: correctAnswer / question.players.length,
      all_players_percent: 0.5, // TODO: global stats from db
    };
  }

  public getCurrentScores(questionNumber: number, player: Player): PlayerScore[] {
    // TODO: calculate scores
    return [
      {
        player_id: 1,
        player_name: 'Mystic Raccoon',
        current_rank: 1,
        current_score: 12000,
        previous_rank: 1,
        previous_score: 12000,
      },
      {
        player_id: 2,
        player_name: 'Chuffed Caterpillar',
        current_rank: 2,
        current_score: 11000,
        previous_rank: 4,
        previous_score: 9000,
      },
      {
        player_id: 3,
        player_name: 'Massive Rodent',
        current_rank: 3,
        current_score: 10000,
        previous_rank: 3,
        previous_score: 10000,
      },
      {
        player_id: 4,
        player_name: 'Psycho Giraffe',
        current_rank: 4,
        current_score: 9000,
        previous_rank: 1,
        previous_score: 9000,
      },
      {
        player_id: 5,
        player_name: 'Angelic Nerd',
        current_rank: 5,
        current_score: 8000,
        previous_rank: 5,
        previous_score: 8000,
      },
      {
        player_id: player.playerId,
        player_name: player.name,
        current_rank: 8,
        current_score: 7000,
        previous_rank: 8,
        previous_score: 7000,
      }
    ];
  }

  public readerForQuestion(question: number) {
    return this.readerOrder[(question - 1) % this.readerOrder.length];
  }
}

export default Game;