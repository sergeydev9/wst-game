import {EventEmitter} from "events";
import Player, {GameStatus} from "./player";

import {
  AnswerValue,
  Game as IGame,
  User as IUser,
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
  public readonly hostRow: IUser;

  public readonly players: Player[] = [];

  public status: 'lobby' | 'pre-lobby' | 'playing' | 'post-game' | 'finished' | 'error' = 'lobby';
  public host: Player;

  public questionNumber = 0;
  public readonly questions: GameQuestion[] = [];

  public reader: Player;
  public readonly readerOrder: Player[] = [];

  constructor(game: IGame, host: IUser, questions: IQuestion[]) {
    super();
    this.gameRow = game;
    this.hostRow = host;

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

  public getActivePlayers(status?: GameStatus) {
    if (status) {
      this.players.filter(p => p.isActive && p.gameStatus === status);
    }
    return this.players.filter(p => p.isActive);
  }

  public joinWaitingRoom(player: Player) {
    if (!player.isActive) {
      throw new Error('Player not active, game: ' + this.gameRow.access_code);
    }

    if (!this.players.includes(player)) {
      throw new Error('Player not in game: ' + this.gameRow.access_code);
    }

    if (player.gameStatus === 'waiting') {
      throw new Error('Player already in waiting room, game: ' + this.gameRow.access_code);
    }

    if (!player.name) {
      throw new Error('Please pick a name, game: ' + this.gameRow.access_code);
    }

    player.gameStatus = 'waiting';
    this.readerOrder.push(player);
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
    this.getActivePlayers('waiting').forEach(p => p.gameStatus = 'playing');

    this.questionNumber++;
    const nextQuestion = this.getQuestion(this.questionNumber);
    nextQuestion.reader = this.readerForQuestion(this.questionNumber);
    nextQuestion.players = [...this.getActivePlayers('playing')];

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