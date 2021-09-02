import Game, {GameQuestion} from "../game/game";
import Player from "../game/player";

import {
  AnswerValue,
  Deck as IDeck,
  Game as IGame,
  GamePlayer as IGamePlayer,
  IInsertAnwser,
  Question as IQuestion
} from '@whosaidtrue/app-interfaces';

import {answersDao, decksDao, gamesDao} from '../db';

import {
  FinalScores,
  FunFact,
  GameState,
  PlayerJoinedGame,
  PlayerLeftGame,
  QuestionScores,
  QuestionState,
  ResultState,
  ScoreState
} from "@whosaidtrue/api-interfaces";

import {Mutex} from 'async-mutex';


class GameService {
  private games = {};
  private locks = {};

  private async getGame(code: string): Promise<Game> {
    if (this.games[code]) {
      return this.games[code];
    }

    return this.createGame(code);
  }

  private async createGame(code: string): Promise<Game> {

    if (this.games[code]) {
      throw new Error(`Game ${code} already exists`);
    }

    const gameResult = await gamesDao.getByAccessCode(code);
    if (gameResult.rowCount !== 1) {
      throw new Error(`Game ${code} not found`);
    }
    const game: IGame = gameResult.rows[0];

    const hostResult = await gamesDao.getHost(game.id);
    if (hostResult.rowCount !== 1) {
      throw new Error(`Game ${code} has no host`);
    }
    const host: IGamePlayer = hostResult.rows[0];

    // TODO: gamesDao.getQuestions(gameRow.id)
    const questions: IQuestion[] = [
      {id: 1, text: 'Text 1', text_for_guess: 'Test for guess 1', follow_up: 'Follow up 1'} as IQuestion,
      {id: 1, text: 'Text 2', text_for_guess: 'Test for guess 2', follow_up: 'Follow up 2'} as IQuestion,
      {id: 1, text: 'Text 3', text_for_guess: 'Test for guess 3', follow_up: 'Follow up 3'} as IQuestion,
      {id: 1, text: 'Text 4', text_for_guess: 'Test for guess 4', follow_up: 'Follow up 4'} as IQuestion,
      {id: 1, text: 'Text 5', text_for_guess: 'Test for guess 5', follow_up: 'Follow up 5'} as IQuestion,
      {id: 1, text: 'Text 6', text_for_guess: 'Test for guess 6', follow_up: 'Follow up 6'} as IQuestion,
      {id: 1, text: 'Text 7', text_for_guess: 'Test for guess 7', follow_up: 'Follow up 7'} as IQuestion,
      {id: 1, text: 'Text 8', text_for_guess: 'Test for guess 8', follow_up: 'Follow up 8'} as IQuestion,
      {id: 1, text: 'Text 9', text_for_guess: 'Test for guess 9', follow_up: 'Follow up 9'} as IQuestion,
      {id: 1, text: 'Text 10', text_for_guess: 'Test for guess 10', follow_up: 'Follow up 10'} as IQuestion,
    ];

    const deckResult = await decksDao.getDetails(game.deck_id);
    const deck: IDeck = deckResult.rows[0];


    const gameInstance = new Game(game, host, deck, questions);

    this.games[code] = gameInstance;
    return gameInstance;
  }

  public async connectPlayer(playerId: number, gameCode: string) {
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
    if (player.clientStatus === 'connected') {
      throw new Error("Already Connected");
    }

    player.clientStatus = 'connected';
    return player;
  }

  private async getPlayer(playerId: number, gameCode: string) {

    const game = await this.getGame(gameCode);
    let player = game.players.find(p => p.playerId == playerId);

    if (!player) {
      player = new Player(playerId, game);
      game.players.push(player);
    }

    return player;
  }

  public disconnectPlayer(player: Player) {

    player.clientStatus = 'disconnected';

    const msg: PlayerLeftGame = {
      event: 'PlayerLeftGame',
      status: 'ok',
      debug: `Player ${player.name} has left the game.`,
      payload: {
        player_name: player.name,
        is_host: player.isHost(),
      },
    };
    player.game.notifyAll(msg);


    if (player.isHost()) {
      // TODO: handle host left
    }
  }

  public joinGame(player: Player, playerName: string) {
    const game = player.game;
    player.name = playerName;
    if (game.hostRow.id == player.playerId) {
      game.host = player;
    }

    player.clientStatus = 'connected';
    game.joinWaitingRoom(player);


    // player joined
    const msg: PlayerJoinedGame = {
      event: 'PlayerJoinedGame',
      status: "ok",
      payload: {
        name: player.name,
        is_host: player.isHost(),
      },
    };
    game.notifyAllExcept(player, msg);

    if (game.questionNumber > 0) {
      player.notify(this.getQuestionState(player, game.questionNumber));
    }
    game.notifyAll(this.getGameState(game));
  }

  public hostNextQuestion(game: Game, player: Player) {
    this.requireHostAction(player);

    const q = game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions gameRow over.');
    }

    game.getConnectedPlayers().forEach(p => p.notify(this.getQuestionState(p, game.questionNumber)));
    game.notifyAll(this.getGameState(game));
  }

  public async submitAnswerPart1(game: Game, player: Player, data: any) {
    this.requireCurrentQuestion(game, data.questionNumber);

    const answer = player.getAnswer(data.questionNumber);
    this.requireAnswerState(answer, 'part-1');

    const question = game.getQuestion(data.questionNumber);
    this.requireValidAnswer(question, data.answer);

    answer.answer = data.answer;
    answer.state = 'part-2';

    player.notify(this.getQuestionState(player, data.questionNumber));
  }

  public async submitAnswerPart2(game: Game, player: Player, data: any) {
    this.requireCurrentQuestion(game, data.questionNumber);

    const answer = player.getAnswer(data.questionNumber);
    this.requireAnswerState(answer, 'part-2');

    const question = game.getQuestion(data.questionNumber);
    this.requireValidGuess(question, data.guess);

    answer.guess = data.guess;
    answer.state = 'finished';

    const answerRow: IInsertAnwser = {
      game_player_id: player.playerId,
      game_question_id: question.questionRow.id,
      game_id: game.gameRow.id,
      value: answer.answer,
      number_true_guess: answer.guess,
    };
    await answersDao.submit(answerRow);

    game.getConnectedPlayers().forEach(p => p.notify(this.getQuestionState(p, data.questionNumber)));

    // auto-advance to results
    const finished = this.countFinishedAnswers(question);
    if (finished >= question.players.length) {
      console.log(`auto advance to results game: ${game.gameRow.access_code}, question: ${game.questionNumber}`);
      this.showResults(game);
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

  public hostShowResults(game: Game, player: Player) {
    this.requireHostAction(player);

    this.showResults(game);
  }

  private showResults(game: Game) {
    game.getConnectedPlayers().forEach(player => {
      const msg = this.getResultState(game.questionNumber, player);
      player.notify(msg);
    });
  }

  public hostShowScores(game: Game, player: Player) {
    this.requireHostAction(player);

    game.getConnectedPlayers().forEach(player => {
      const msg = this.getScoreState(game.questionNumber, player);
      player.notify(msg);
    });
  }

  public hostShowFinalScores(game: Game, player: Player) {
    this.requireHostAction(player);

    game.getConnectedPlayers().forEach(player => {
      const msg = this.getScoreState(game.questionNumber, player);

      // final scores has extra fun facts
      msg.payload.fun_facts = this.getFunFacts(player);
      player.notify(msg);
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
        reader_name: q.reader.name,
      }
    };
  }

  private getGameState(game: Game): GameState {
    return {
      event: 'GameState',
      status: "ok",
      payload: {
        game_id: game.gameRow.id,
        host_id: game.hostRow.id,
        status: game.status,
        current_players: game.getConnectedPlayers().map(p => p.name),
        total_questions: game.questions.length,
        current_question: game.questionNumber,
        deck_id: game.deckRow.id
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
