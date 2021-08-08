import Game from "../game/game";
import Player from "../game/player";
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

class GameService {
  private games = {};

  public devOnlyFindOrCreateGame(code: string) {
    const game = this.findGame(code);
    return game ? game : this.createGame(code);
  }

  public findGame(code: string) {
    return this.games[code];
  }

  public createGame(code: string): Game {

    // TODO: init from db or return error
    const game = new Game(code, {
      name: 'Fake Deck',
      questions: [
        {text: 'GameQuestion 1', type: 'Entertainment'},
        {text: 'GameQuestion 2', type: 'Entertainment'},
        {text: 'GameQuestion 3', type: 'Entertainment'},
        {text: 'GameQuestion 4', type: 'Entertainment'},
        {text: 'GameQuestion 5', type: 'Entertainment'},
        {text: 'GameQuestion 6', type: 'Entertainment'},
        {text: 'GameQuestion 7', type: 'Entertainment'},
        {text: 'GameQuestion 8', type: 'Entertainment'},
        {text: 'GameQuestion 9', type: 'Entertainment'},
        {text: 'GameQuestion 10', type: 'Entertainment'},
      ],
    });

    this.games[game.code] = game;
    return game;
  }

  public createPlayer(playerId: string, game: Game) {
    // TODO: check re-join
    const player = new Player(playerId, game);

    game.connected.push(player);

    // TODO: persist db?

    return player;
  }

  public disconnectPlayer(player: Player) {
    const game = player.game;

    let index = game.connected.indexOf(player);
    if (index > -1) {
      game.connected.splice(index, 1);
      game.disconnected.push(player);
      player.emit("disconnected");
      game.emit('disconnected', player);

      const msg: PlayerLeftGame = {
        event: 'PlayerLeftGame',
        status: 'ok',
        debug: `Player ${player.name} has left the game.`,
        payload: {
          playerName: player.name,
        },
      };
      game.notifyAll(msg);
    }

    index = game.waiting.indexOf(player);
    if (index > -1) {
      game.waiting.splice(index, 1);
    }

    index = game.active.indexOf(player);
    if (index > -1) {
      game.active.splice(index, 1);
    }

    if (game.host?.playerId == player.playerId) {
      game.host = null;
      // TODO: handle host gone
    }
  }

  public playerJoinGame(game: Game, player: Player, playerName: string) {
    if (!game.checkName(playerName)) {
      throw new Error(`Sorry! The name '${playerName}' is already taken, game: ${game.code}`);
    }

    player.name = playerName;
    game.joinWaitingRoom(player);

    const msg: PlayerJoinedGame = {
      event: 'PlayerJoinedGame',
      status: "ok",
      debug: `New player '${player.name}' joined the game`,
      payload: {
        newPlayer: player.name,
        currentPlayers: game.waiting.map(p => p.name),
      },
    };
    game.notifyAll(msg);
  }

  public hostJoinGame(game: Game, player: Player, playerName: string) {
    if (!game.checkName(playerName)) {
      throw new Error(`Sorry! The name '${playerName}' is already taken, game: ${game.code}`);
    }

    player.name = playerName;
    game.host = player;
    game.joinWaitingRoom(player);

    const msg: HostJoinedGame = {
      event: 'HostJoinedGame',
      status: "ok",
      debug: `The host '${player.name}' joined the game`,
      payload: {
        newPlayer: player.name,
        currentPlayers: game.waiting.map(p => p.name),
      },
    };
    game.notifyAll(msg);
  }

  public nextQuestion(game: Game, player: Player) {
    if (game.host?.playerId != player.playerId) {
      throw new Error('Only the host can advance to next question.');
    }

    const q = game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions game over.');
    }

    const msg: QuestionPart1 = {
      event: 'QuestionPart1',
      status: 'ok',
      payload: {
        readerId: q.reader.playerId,
        readerName: q.reader.name,
        questionNumber: game.questionNumber,
        questionTotal: game.questions.length,
        questionText: q.text,
      },
    };
    game.notifyActive(msg);
  }

  public playerAnswerPart1(game: Game, player: Player, data: any) {
    if (game.questionNumber < 1) {
      throw new Error(`Game ${game.code} hasn't started yet!`);
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
        questionText: 'How many players answered true for ' + q.text,

      },
    };
    player.notify(msg);
  }

  public playerAnswerPart2(game: Game, player: Player, data: any) {
    if (game.questionNumber < 1) {
      throw new Error(`Game ${game.code} hasn't started yet!`);
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
    game.notifyActive(msg);

    // auto-advance to results
    if (answersCount >= playersCount) {
      this.showResults(game);
    }
  }

  public forceShowResults(game: Game, player: Player) {
    if (game.host?.playerId != player.playerId) {
      throw new Error('Only the host can advance to results before all players have answered.');
    }

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
    game.notifyActive(msg);
  }

  public showScores(game: Game, player: Player) {
    if (game.host?.playerId != player.playerId) {
      throw new Error('Only the host can advance to scores.');
    }

    const gameScore = game.currentScore();
    const header: QuestionScores = {
      event: 'QuestionScores',
      status: 'ok',
      debug: `Scores for question ${game.questionNumber}`,
    };

    game.active.forEach(player => {
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
    if (game.host != player) {
      throw new Error('Only the host can advance to final scores.');
    }

    const gameScore = game.currentScore();
    const header: FinalScores = {
      event: 'FinalScores',
      status: 'ok',
      debug: `Final scores for game: ${game.code}`,
    };

    game.active.forEach(player => {
      const msg: FinalScores = {
        ...header,
        payload: {
          gameScore: gameScore,
          playerScore: player.currentScore(),
          funFacts: this.funFacts(game, player),
          deckName: game.deck.name,
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
