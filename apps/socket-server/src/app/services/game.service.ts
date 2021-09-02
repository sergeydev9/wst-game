import Game from "../game/game";
import Player from "../game/player";

import {
  Game as IGame,
  Deck as IDeck,
  Question as IQuestion,
  GameAnswer as IGameAnswer,
  GamePlayer as IGamePlayer, IInsertGame, IInsertAnwser
} from '@whosaidtrue/app-interfaces';

import {answersDao, decksDao, gamesDao} from '../db';

import {
  FinalScores,
  GameState,
  PlayerJoinedGame,
  PlayerLeftGame,
  QuestionResults,
  QuestionScores,
  QuestionState,
  ResultState
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
    const deck = deckResult.rows[0];


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
        playerName: player.name,
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
      player.notify(this.getQuestionState(player));
    }
    game.notifyAll(this.getGameState(game));
  }

  public nextQuestion(game: Game, player: Player) {
    player.requireHost();

    const q = game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions gameRow over.');
    }

    game.getPlayers().forEach(p => p.notify(this.getQuestionState(p)));
    game.notifyAll(this.getGameState(game));
  }

  public async submitAnswerPart1(game: Game, player: Player, data: any) {
    if (game.questionNumber < 1) {
      throw new Error(`Game ${game.gameRow.access_code} hasn't started yet!`);
    }

    if (game.questionNumber != data.questionNumber) {
      throw new Error(`Expecting answer for question ${game.questionNumber} but got ${data.questionNumber}`);
    }

    const q = game.getQuestion(data.questionNumber);

    let answer = q.answers.find(a => a.player.playerId == player.playerId);

    if (!answer) {
      answer = {player: player, state: 'part-1'};
      q.answers.push(answer);
    }

    // prevent player from answering multiple times
    if (answer.answer !== undefined) {
      throw Error(`Already answered question ${data.questionNumber} with ${answer.answer}`);
    }

    answer.answer = data.answer;
    answer.state = 'part-2';

    player.notify(this.getQuestionState(player));
    game.notifyAll(this.getGameState(game));
  }

  public async submitAnswerPart2(game: Game, player: Player, data: any) {
    if (game.questionNumber < 1) {
      throw new Error(`Game ${game.gameRow.access_code} hasn't started yet!`);
    }

    if (game.questionNumber != data.questionNumber) {
      throw new Error(`Expecting answer for question ${game.questionNumber} but got ${data.questionNumber}`);
    }

    const q = game.getQuestion(data.questionNumber);

    const answer = q.answers.find(a => a.player.playerId == player.playerId);

    if (!answer) {
      throw Error(`Must answer question ${data.questionNumber} before guessing.`);
    }

    // prevent player from guessing multiple times
    if (answer.guess !== undefined) {
      throw Error(`Already guessed question ${data.questionNumber} with ${answer.guess}%`);
    }

    const playersCount = q.players.length;

    if (data.guess < 0 || data.guess > playersCount) {
      throw Error(`Invalid guess, should be a value between 0 and ${playersCount}`);
    }

    answer.guess = data.guess;
    answer.state = 'finished';

    const answerRow: IInsertAnwser = {
      game_player_id: player.playerId,
      game_question_id: q.questionRow.id,
      game_id: game.gameRow.id,
      value: answer.answer,
      number_true_guess: answer.guess,
    };
    await answersDao.submit(answerRow);

    game.getPlayers().forEach(p => p.notify(this.getQuestionState(p)));

    // auto-advance to results
    const answersCount = q.answers.filter(a => a.answer !== undefined && a.guess !== undefined).length;
    if (answersCount >= playersCount) {
      this.showResults(game);
    }
  }

  public forceShowResults(game: Game, player: Player) {
    player.requireHost();

    this.showResults(game);
  }

  public showResults(game: Game) {
    const msg: QuestionResults = {
      event: 'QuestionResults',
      status: 'ok',
      debug: `Results for question ${game.questionNumber}`,
      payload: {
        questionNumber: game.questionNumber,
        results: game.questionResults(game.questionNumber)
      },
    };
    game.notifyPlaying(msg);
  }

  public showScores(game: Game, player: Player) {
    player.requireHost();

    const gameScore = game.currentScore();
    const header: QuestionScores = {
      event: 'QuestionScores',
      status: 'ok',
      debug: `Scores for question ${game.questionNumber}`,
    };

    game.getPlayers('playing').forEach(player => {
      const msg: QuestionScores = {
        ...header,
        payload: {
          questionNumber: game.questionNumber,
          gameScore: gameScore,
          playerScore: player.currentScore(),
        },
      };
      player.notify(msg);
    });
  }

  public showFinalScores(game: Game, player: Player) {
    player.requireHost();

    const gameScore = game.currentScore();
    const header: FinalScores = {
      event: 'FinalScores',
      status: 'ok',
      debug: `Final scores for game: ${game.gameRow.access_code}`,
    };

    game.getPlayers('playing').forEach(player => {
      const msg: FinalScores = {
        ...header,
        payload: {
          gameScore: gameScore,
          playerScore: player.currentScore(),
          funFacts: this.funFacts(game, player),
          deckName: game.deckRow.name,
        },
      };
      player.notify(msg);
    });
  }

  public getQuestionState(player: Player): QuestionState {
    const q = player.game.currentQuestion();
    const a = q.answers.find(a => a.player.playerId == player.playerId);
    const playersCount = q.players.length;
    const answersCount = q.answers.filter(a => a.answer !== undefined && a.guess !== undefined).length;
    return {
      event: 'QuestionState',
      status: "ok",
      payload: {
        question_id: q.questionRow.id,
        status: a && a.state ? a.state : 'part-1',
        primary_text: q.questionRow.text,
        secondary_text: q.questionRow.text_for_guess,
        question_sequence_index: player.game.questionNumber,
        number_pending_answers: playersCount - answersCount,
        reader_name: q.reader.name,
      }
    };
  }

  public getGameState(game: Game): GameState {
    return {
      event: 'GameState',
      status: "ok",
      payload: {
        game_id: game.gameRow.id,
        host_id: game.hostRow.id,
        status: game.status,
        current_players: game.getPlayers().map(p => p.name),
        total_questions: game.questions.length,
        current_question: game.questionNumber,
        deck_id: game.deckRow.id
      }
    };
  }

  public getResultsState(game: Game): ResultState {
    return {} as ResultState;  // TODO
  }

  public funFacts(game: Game, player: Player) {
    // TODO: implement fun facts
    return [
      {
        title: 'Bucket List Challenge',
        subTitle: 'Been to another country',
        yourGroup: 0,
        allPlayers: 0.5,
      },
      {
        title: 'Your Group vs. All Players',
        subTitle: 'Drunk a body shot off someone.',
        yourGroup: 1,
        allPlayers: 0.5,
      },
      {
        title: 'Most Similar Players',
        subTitle: 'Bene & Game Name',
        bodyText: 'Bene & Game Name answered 75% of questions similarly.',
      },
      {
        title: 'Most Similar To You',
        subTitle: 'John Doe',
        bodyText: 'You and John Doe answered 50% of questions similarly.',
      },
    ];
  }
}

export default GameService;
