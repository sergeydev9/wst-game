import Game from "../game/game";
import Player from "../game/player";

import {GamePlayerRow, GameRow, QuestionRow} from '@whosaidtrue/data';

import {decksDao, gamesDao} from '../db';

import {
  FinalScores,
  HostJoinedGame,
  PlayerAnswered,
  PlayerJoinedGame,
  PlayerLeftGame,
  QuestionPart1,
  QuestionPart2,
  QuestionResults,
  QuestionScores
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
    const game: GameRow = gameResult.rows[0];

    const hostResult = await gamesDao.getHost(game.id);
    if (hostResult.rowCount !== 1) {
      throw new Error(`Game ${code} has no host`);
    }
    const host: GamePlayerRow = hostResult.rows[0];

    // TODO: gamesDao.getQuestions(gameRow.id)
    const questions: QuestionRow[] = [
      {text: 'Text 1', text_for_guess: 'Test for guess 1', follow_up: 'Follow up 1'} as QuestionRow,
      {text: 'Text 2', text_for_guess: 'Test for guess 2', follow_up: 'Follow up 2'} as QuestionRow,
      {text: 'Text 3', text_for_guess: 'Test for guess 3', follow_up: 'Follow up 3'} as QuestionRow,
      {text: 'Text 4', text_for_guess: 'Test for guess 4', follow_up: 'Follow up 4'} as QuestionRow,
      {text: 'Text 5', text_for_guess: 'Test for guess 5', follow_up: 'Follow up 5'} as QuestionRow,
      {text: 'Text 6', text_for_guess: 'Test for guess 6', follow_up: 'Follow up 6'} as QuestionRow,
      {text: 'Text 7', text_for_guess: 'Test for guess 7', follow_up: 'Follow up 7'} as QuestionRow,
      {text: 'Text 8', text_for_guess: 'Test for guess 8', follow_up: 'Follow up 8'} as QuestionRow,
      {text: 'Text 9', text_for_guess: 'Test for guess 9', follow_up: 'Follow up 9'} as QuestionRow,
      {text: 'Text 10', text_for_guess: 'Test for guess 10', follow_up: 'Follow up 10'} as QuestionRow,
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


    const msg: PlayerJoinedGame = {
      event: (player.isHost()) ? 'PlayerJoinedGame' : 'HostJoinedGame',
      status: "ok",
      debug: `New player '${player.name}' joined the game`,
      payload: {
        newPlayer: player.name,
        currentPlayers: game.getPlayers().map(p => p.name),
        clientStatus: player.clientStatus,
        gameStatus: player.gameStatus,
        host: player.isHost(),
      },
    };
    game.notifyAll(msg);
  }

  public nextQuestion(game: Game, player: Player) {
    player.requireHost();

    const q = game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions gameRow over.');
    }

    const msg: QuestionPart1 = {
      event: 'QuestionPart1',
      status: 'ok',
      payload: {
        readerId: q.reader.playerId,
        readerName: q.reader.name,
        questionNumber: game.questionNumber,
        questionTotal: game.questions.length,
        questionText: q.questionRow.text,
      },
    };
    game.notifyPlaying(msg);
  }

  public playerAnswerPart1(game: Game, player: Player, data: any) {
    if (game.questionNumber < 1) {
      throw new Error(`Game ${game.gameRow.access_code} hasn't started yet!`);
    }

    if (game.questionNumber != data.questionNumber) {
      throw new Error(`Expecting answer for question ${game.questionNumber} but got ${data.questionNumber}`);
    }

    const q = game.getQuestion(data.questionNumber);

    let answer = q.answers.find(a => a.player.playerId == player.playerId);

    // prevent player from answering multiple times
    if (answer?.answer !== undefined) {
      throw Error(`Already answered question ${data.questionNumber} with ${answer.answer}`);
    }

    if (!answer) {
      answer = {player: player};
      q.answers.push(answer);
    }

    // record part 1
    answer.answer = data.answer;

    // send part 2
    const msg: QuestionPart2 = {
      event: 'QuestionPart2',
      status: 'ok',
      payload: {
        playersCount: q.players.length,
        questionNumber: game.questionNumber,
        questionTotal: game.questions.length,
        questionText: 'How many players answered true for ' + q.questionRow.text,

      },
    };
    player.notify(msg);
  }

  public playerAnswerPart2(game: Game, player: Player, data: any) {
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

    if (data.guess < 0.0 || data.guess > 1.0) {
      throw Error(`Invalid guess, should be a percentage between 0 and 1.`);
    }

    // record part 2
    answer.guess = data.guess;

    const playersCount = q.players.length;
    const answersCount = q.answers.filter(a => a.answer !== undefined && a.guess !== undefined).length;

    const msg: PlayerAnswered = {
      event: 'PlayerAnswered',
      status: 'ok',
      debug: `Player ${player.name} answered question ${data.questionNumber}`,
      payload: {
        playerName: player.name,
        playersAnswered: q.answers.map(a => a.player.name),
        playersCount: playersCount,
        answersCount: answersCount,
      },
    };
    game.notifyPlaying(msg);

    // auto-advance to results
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
