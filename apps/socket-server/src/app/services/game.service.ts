import Game, { GameQuestion } from "../game/game";
import Player from "../game/player";
import NodeCache from "node-cache";

import {
  AnswerValue,
  Game as IGame,
  User as IUser,
  GamePlayer as IGamePlayer,
  IInsertAnwser,
  Question as IQuestion
} from '@whosaidtrue/app-interfaces';

import { answersDao, gamePlayersDao, gamesDao, usersDao } from '../db';

import {
  FunFact,
  GameState,
  PlayerJoinedGame,
  PlayerLeftGame,
  QuestionState,
  ResultState,
  ScoreState
} from "@whosaidtrue/api-interfaces";

import { Mutex } from 'async-mutex';


class GameService {

  private cache = new NodeCache({
    useClones: false,         // TODO false
    stdTTL: 1 * 24 * 60 * 60, // 1 day
    checkperiod: 1 * 60 * 60, // 1 hour
  });
  private locks = {};

  private async getGame(code: string): Promise<Game> {
    if (this.cache.has(code)) {
      return this.cache.get(code);
    }

    return this.createGame(code);
  }

  private async createGame(code: string): Promise<Game> {

    if (this.cache.has(code)) {
      throw new Error(`Game ${code} already exists`);
    }

    const game = (await gamesDao.getByAccessCode(code)).rows[0];
    if (!game) {
      throw new Error(`Game ${code} not found`);
    }

    const host: IGamePlayer = (await gamePlayersDao.getPlayerByGameIdAndUserId(game.id, game.host_id)).rows[0];

    // TODO: gamesDao.getQuestions(gameRow.id)
    const questions: IQuestion[] = [
      { id: 1, text: 'Text 1', text_for_guess: 'Test for guess 1', follow_up: 'Follow up 1' } as IQuestion,
      { id: 1, text: 'Text 2', text_for_guess: 'Test for guess 2', follow_up: 'Follow up 2' } as IQuestion,
      { id: 1, text: 'Text 3', text_for_guess: 'Test for guess 3', follow_up: 'Follow up 3' } as IQuestion,
      { id: 1, text: 'Text 4', text_for_guess: 'Test for guess 4', follow_up: 'Follow up 4' } as IQuestion,
      { id: 1, text: 'Text 5', text_for_guess: 'Test for guess 5', follow_up: 'Follow up 5' } as IQuestion,
      { id: 1, text: 'Text 6', text_for_guess: 'Test for guess 6', follow_up: 'Follow up 6' } as IQuestion,
      { id: 1, text: 'Text 7', text_for_guess: 'Test for guess 7', follow_up: 'Follow up 7' } as IQuestion,
      { id: 1, text: 'Text 8', text_for_guess: 'Test for guess 8', follow_up: 'Follow up 8' } as IQuestion,
      { id: 1, text: 'Text 9', text_for_guess: 'Test for guess 9', follow_up: 'Follow up 9' } as IQuestion,
      { id: 1, text: 'Text 10', text_for_guess: 'Test for guess 10', follow_up: 'Follow up 10' } as IQuestion,
    ];

    const gameInstance = new Game(game, host, questions);

    this.cache.set(code, gameInstance)
    return gameInstance;
  }

  public async join(playerId: number, gameCode: string): Promise<Player> {
    if (!this.locks[gameCode]) {
      this.locks[gameCode] = new Mutex();
    }

    let player;
    const release = await this.locks[gameCode].acquire();
    try {
      player = await this.getPlayer(playerId, gameCode);
    } finally {
      release();
    }

    // don't allow multiple connections
    // TODO: disconnect the other player instead?
    if (player.isActive) {
      throw new Error("Player already active. No duplicate players allowed.");
    }

    this.joinGame(player);
    return player;
  }

  private async getPlayer(playerId: number, gameCode: string) {

    const game = await this.getGame(gameCode);
    let player = game.players.find(p => p.playerId == playerId);

    if (!player) {
      const playerRow: IGamePlayer = (await gamePlayersDao.getById(playerId)).rows[0];
      if (!playerRow) {
        throw new Error(`Player ID ${playerId} not found`);
      }

      player = new Player(playerRow.user_id, playerId, game);
      game.players.push(player);
    }

    return player;
  }

  public disconnectPlayer(player: Player) {

    player.isActive = false;

    const msg: PlayerLeftGame = {
      event: 'PlayerLeftGame',
      status: 'ok',
      debug: `Player ${player.name} has left the game.`,
      payload: {
        player_name: player.name,
        id: player.playerId
      },
    };
    player.game.getActivePlayers().forEach(p => p.emit('message', msg));


    if (player.isHost()) {
      // TODO: handle host left
    }
  }

  private joinGame(player: Player) {
    const game = player.game;
    if (player.isHost()) {
      game.host = player;
    }

    player.isActive = true;
    game.join(player);



    const joinedMsg: PlayerJoinedGame = {
      event: 'PlayerJoinedGame',
      status: "ok",
      payload: {
        player_name: player.name,
        id: player.playerId
      },
    };
    const gameStateMsg = this.getGameState(game);
    game.getActivePlayers()
      .forEach(p => {
        // let everyone else know player joined
        if (p != player) {
          p.emit('message', joinedMsg)
        }

        // everyone gets the new game state
        p.emit('message', gameStateMsg)

      });

    if (game.questionNumber > 0) {
      player.emit('message', this.getQuestionState(player, game.questionNumber));
    }
  }

  public hostNextQuestion(player: Player) {
    this.requireHostAction(player);

    const q = player.game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions gameRow over.');
    }

    const gameStateMsg = this.getGameState(player.game);
    player.game.getActivePlayers().forEach(p => {
      p.emit('message', this.getQuestionState(p, player.game.questionNumber));
      p.emit('message', gameStateMsg);
    });
  }

  public async submitAnswerPart1(player: Player, data: any) {
    this.requireCurrentQuestion(player.game, data.question_number);

    const answer = player.getAnswer(data.question_number);
    this.requireAnswerState(answer, 'part-1');

    const question = player.game.getQuestion(data.question_number);
    this.requireValidAnswer(question, data.answer);

    answer.answer = data.answer;
    answer.state = 'part-2';

    player.emit('message', this.getQuestionState(player, data.question_number));
  }

  public async submitAnswerPart2(player: Player, data: any) {
    this.requireCurrentQuestion(player.game, data.question_number);

    const answer = player.getAnswer(data.question_number);
    this.requireAnswerState(answer, 'part-2');

    const question = player.game.getQuestion(data.question_number);
    this.requireValidGuess(question, data.guess);

    answer.guess = data.guess;
    answer.state = 'finished';

    const answerRow: IInsertAnwser = {
      game_player_id: player.playerId,
      game_question_id: question.questionRow.id,
      game_id: player.game.gameRow.id,
      value: answer.answer,
      number_true_guess: answer.guess,
    };
    await answersDao.submit(answerRow);

    player.game.getActivePlayers().forEach(p => p.emit('message', this.getQuestionState(p, data.question_number)));

    // auto-advance to results
    const finished = this.countFinishedAnswers(question);
    if (finished >= question.players.length) {
      console.log(`auto advance to results game: ${player.game.gameRow.access_code}, question: ${player.game.questionNumber}`);
      this.showResults(player.game);
    }
  }

  private requireHostAction(player: Player) {
    if (!player.isHost()) {
      throw new Error("You need to be a host to perform this action.")
    }
  }

  private requireAnswerState(answer, state: string) {
    if (answer.state != state) {
      throw Error(`Expecting question state: ${state} but got '${answer.state}'`);
    }
  }

  private requireCurrentQuestion(game: Game, questionNumber: number) {
    if (game.questionNumber != questionNumber) {
      throw new Error(`Expecting answer for question ${game.questionNumber} but got ${questionNumber}`);
    }
  }

  private requireValidAnswer(question: GameQuestion, answer?: AnswerValue) {
    if (!answer) {
      throw Error(`Invalid answer, should be one of ['pass', 'true', 'false]`);
    }
    // TODO: allow only one pass?
  }

  private requireValidGuess(question: GameQuestion, guess?: number) {
    if (!guess || guess < 0 || guess > question.players.length) {
      throw Error(`Invalid guess, should be a value between 0 and ${question.players.length}`);
    }
  }

  private countFinishedAnswers(question: GameQuestion) {
    return question.answers.filter(a => a.state == 'finished').length;
  }

  private countTrueAnswers(question: GameQuestion) {
    return question.answers.filter(a => a.answer == 'true').length;
  }

  public hostShowResults(player: Player) {
    this.requireHostAction(player);

    this.showResults(player.game);
  }

  private showResults(game: Game) {
    game.getActivePlayers().forEach(player => {
      const msg = this.getResultState(game.questionNumber, player);
      player.emit('message', msg);
    });
  }

  public hostShowScores(player: Player) {
    this.requireHostAction(player);

    player.game.getActivePlayers().forEach(player => {
      const msg = this.getScoreState(player.game.questionNumber, player);
      player.emit('message', msg);
    });
  }

  public hostShowFinalScores(player: Player) {
    this.requireHostAction(player);

    player.game.getActivePlayers().forEach(player => {
      const msg = this.getScoreState(player.game.questionNumber, player);

      // final scores has extra fun facts
      msg.payload.fun_facts = this.getFunFacts(player);
      player.emit('message', msg);
    });
  }

  private getQuestionState(player: Player, questionNumber: number): QuestionState {
    const q = player.game.getQuestion(questionNumber);
    const a = player.getAnswer(questionNumber);
    return {
      event: 'QuestionState',
      status: "ok",
      payload: {
        question_id: q.questionRow.id,
        status: a.state,
        primary_text: q.questionRow.text,
        secondary_text: q.questionRow.text_for_guess,
        question_sequence_index: player.game.questionNumber,
        number_pending_answers: q.players.length - this.countFinishedAnswers(q),
        reader_name: q.reader?.name,
      }
    };
  }

  private getGameState(game: Game): GameState {
    return {
      event: 'GameState',
      status: "ok",
      payload: {
        game_id: game.gameRow.id,
        host_id: game.hostPlayerRow?.user_id,
        host_player_id: game.hostPlayerRow?.id,
        status: game.status,
        current_players: game.getActivePlayers().map(p => p.name),
        total_questions: game.questions.length,
        current_question: game.questionNumber,
      }
    };
  }

  private getResultState(questionNumber: number, player: Player): ResultState {
    return {
      event: 'ResultState',
      status: 'ok',
      payload: {
        ...player.game.questionResults(questionNumber, player),
      },
    };
  }

  private getScoreState(questionNumber: number, player: Player): ScoreState {
    const q = player.game.getQuestion(questionNumber);
    const a = player.getAnswer(questionNumber);
    return {
      event: 'ScoreState',
      status: 'ok',
      payload: {
        question_number: player.game.questionNumber,
        question_total: player.game.questions.length,
        player_guess: a.guess,
        correct_answer: this.countTrueAnswers(q),
        scoreboard: player.game.getCurrentScores(questionNumber, player)
      },
    };
  }

  private getFunFacts(player: Player): FunFact[] {
    // TODO: get from db
    return [
      {
        title: 'Bucket List Challenge',
        subtitle: 'Been to another country',
        body: {
          your_group_percent: 0,
          all_players_percent: 0.5,
        }
      },
      {
        title: 'Your Group vs. All Players',
        subtitle: 'Drunk a body shot off someone.',
        body: {
          your_group_percent: 1,
          all_players_percent: 0.5,
        }
      },
      {
        title: 'Most Similar Players',
        subtitle: 'Bene & Game Name',
        body: {
          text: 'Bene & Game Name answered 75% of questions similarly.',
        }
      },
      {
        title: 'Most Similar To You',
        subtitle: 'John Doe',
        body: {
          text: 'You and John Doe answered 50% of questions similarly.',
        }
      },
    ];
  }
}

export default GameService;
