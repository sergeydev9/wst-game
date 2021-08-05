import Game from "../game/game";
import Player from "../game/player";

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
        { text: 'Question 1', type: 'Entertainment' },
        { text: 'Question 2', type: 'Entertainment' },
        { text: 'Question 3', type: 'Entertainment' },
        { text: 'Question 4', type: 'Entertainment' },
        { text: 'Question 5', type: 'Entertainment' },
        { text: 'Question 6', type: 'Entertainment' },
        { text: 'Question 7', type: 'Entertainment' },
        { text: 'Question 8', type: 'Entertainment' },
        { text: 'Question 9', type: 'Entertainment' },
        { text: 'Question 10', type: 'Entertainment' },
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
      game.notifyAll({
        event: 'PlayerLeft',
        success: true,
        message: `Player ${player.name} has left the game.`,
        data: {
          playerName: player.name,
        },
      });
    }

    index = game.waiting.indexOf(player);
    if (index > -1) {
      game.waiting.splice(index, 1);
    }

    index = game.active.indexOf(player);
    if (index > -1) {
      game.active.splice(index, 1);
    }

    if (game.host == player) {
      game.host = null;
      // TODO: handle host gone
    }
  }

  public joinWaitingRoom(game: Game, player: Player, playerName: string) {
    if (!game.checkName(playerName)) {
      throw new Error(`Sorry! The name '${playerName}' is already taken, game: ${game.code}`);
    }

    player.name = playerName;
    game.joinWaitingRoom(player);

    game.notifyAll({
      event: 'PlayerJoinedGame',
      success: true,
      message: `New player '${player.name}' joined the waiting room.`,
      data: {
        gameHost: game.host?.name,
        newPlayer: player.name,
        currentPlayers: game.waiting.map(p => p.name),
      },
    });
  }

  public nextQuestion(game: Game, player: Player) {
    if (game.host != player) {
      throw new Error('Only the host can advance to next question.');
    }

    const q = game.nextQuestion();
    if (q == null) {
      throw new Error('No more questions game over.');
    }

    // reader gets the question
    game.reader.notify({
      event: 'ReadQuestion',
      success: true,
      message: 'Please read the question to the group.',
      data: {
        questionNumber: game.questionNumber,
        questionTotal: game.questionsLength,
        questionText: q.text,
        questionType: q.type,
      },
    });

    // everyone else listens
    game.active
      .filter(p => p != game.reader)
      .forEach(p =>
        p.notify({
          event: 'ListenQuestion',
          success: true,
          message: 'Listen closely to the reader.',
          data: {
            readerName: game.reader.name,
            questionNumber: game.questionNumber,
            questionTotal: game.questionsLength,
            questionType: q.type,
          },
        }),
      );
  }

  public answerQuestion(game: Game, player: Player) {
    if (game.reader != player) {
      throw new Error('Only the reader can advance to question input.');
    }

    const q = game.currentQuestion();
    if (q == null) {
      throw new Error('No more questions to answer.');
    }

    game.notifyActive({
      event: 'AnswerQuestion',
      success: true,
      message: 'Please answer the question.',
      data: {
        questionNumber: game.questionNumber,
        questionTotal: game.questionsLength,
        questionText: q.text,
        questionType: q.type,
        groupCount: game.active.length,
        hint1: 'Answer whether the question is True or False for YOU. All answers are anonymous.',
        hist2: 'Guess how many of the players (including yourself) answered "True", for that same question',
      },
    });
  }

  public playerAnswer(game: Game, player: Player, data: any) {
    if (game.questionNumber != data.questionNumber) {
      throw new Error(`Expecting answer for question ${game.questionNumber} but got ${data.questionNumber}`);
    }

    const q = game.getQuestion(data.questionNumber);

    if (q.answers.map(a => a.player).includes(player)) {
      throw Error(`Already answered question ${data.questionNumber} with ${data.answer}`);
    }

    if (data.guess < 0.0 || data.guess > 1.0) {
      throw Error(`Invalid guess, should be a percentage between 0 and 1.`);
    }

    q.answers.push({
      player: player,
      answer: data.answer,
      guess: data.guess,
    });

    const playersCount = game.active.length;
    const answersCount = q.answers.length;

    game.notifyActive({
      event: 'QuestionAnswered',
      success: true,
      message: `Player ${player.name} answered question ${data.questionNumber}`,
      data: {
        playerName: player.name,
        playersCount: playersCount,
        answersCount: answersCount,
      },
    });

    // auto-advance to results
    if (answersCount >= playersCount) {
      this.showResults(game);
    }
  }

  public forceShowResults(game: Game, player: Player) {
    if (game.host != player) {
      throw new Error('Only the host can advance to results before all players have answered.');
    }

    this.showResults(game);
  }

  public showResults(game: Game) {
    game.notifyActive({
      event: 'QuestionResults',
      success: true,
      message: `Results for question ${game.questionNumber}`,
      data: {
        results: game.currentResults(),
      },
    });
  }

  public showScores(game: Game, player: Player) {
    if (game.host != player) {
      throw new Error('Only the host can advance to scores.');
    }

    const scores = game.currentScores();
    const header = {
      event: 'PlayerScores',
      success: true,
      message: `Scores for question ${game.questionNumber}`,
    };

    game.active.forEach(player => {
      player.notify({
        ...header,
        data: {
          scores: scores,
          myScore: player.currentScore(),
        },
      });
    });
  }

  public showFinalScores(game: Game, player: Player) {
    if (game.host != player) {
      throw new Error('Only the host can advance to final scores.');
    }

    const scores = game.currentScores();
    const header = {
      event: 'FinalScores',
      success: true,
      message: `Final scores for game: ${game.code}`,
    };

    game.active.forEach(player => {
      player.notify({
        ...header,
        data: {
          scores: scores,
          myScore: player.currentScore(),
          funFacts: this.funFacts(game, player),
          deckName: game.deck.name,
        },
      });
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
