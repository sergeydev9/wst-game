import { Socket } from 'socket.io';

/**
 * Redis keys that hold data relevant to the connecting socket
 */
export class Keys {
    readonly gameKey: string;
    readonly playerKey: string;
    readonly questionKey: string;
    readonly currentPlayers: string;
    readonly gameStatus: string;
    readonly removedPlayers: string;
    readonly readerList: string;
    readonly currentQuestion: string; // question data
    readonly answerIds: string;
    readonly hasPassed: string;
    readonly totalQuestions: string;
    readonly currentSequenceIndex: string;
    readonly scoreboard: string;
    readonly latestResults: string;
    readonly currentQuestionId: string;
    readonly bucketList: string;
    readonly groupVworld: string;
    readonly playerMostSimilar: string;
    readonly locks: string;

    constructor(socket: Socket) {
        this.gameKey = `games:${socket.gameId}`; // keyspace for the game
        this.playerKey = `players:${socket.playerId}`; // keyspace for the player
        this.currentPlayers = `${this.gameKey}:currentPlayers`; // set of currently connected players
        this.removedPlayers = `${this.gameKey}:removed`; // set of players that have been removed from the game
        this.gameStatus = `${this.gameKey}:status`; // status as string
        this.readerList = `${this.gameKey}:readers`; // set of players. Used to build a reader queue
        this.currentQuestionId = `${this.gameKey}:currentQuestionId`;
        this.currentQuestion = `${this.gameKey}:currentQuestion`; // question data in json string format
        this.answerIds = `${this.playerKey}:answerIds`;
        this.hasPassed = `${this.playerKey}:hasPassed`; // used to track whether or not a player has passed
        this.totalQuestions = `${this.gameKey}:totalQuestions`; // total number of questions for a game
        this.currentSequenceIndex = `${this.gameKey}:currentSequenceIndex`;
        this.scoreboard = `${this.gameKey}:rankedlist`; // sorted set of player names / scores
        this.latestResults = `${this.gameKey}:latestResults`;
        this.bucketList = `${this.gameKey}:bucketList`;
        this.groupVworld = `${this.gameKey}:groupVworld`;
        this.playerMostSimilar = `${this.gameKey}:similaritySets:${socket.playerName}`
        this.locks = `${this.gameKey}:locks`
    }

    static totalTrue(questionId: number) {
        return `gameQuestions:${questionId}:totalTrue`
    }

    static totalPlayers(questionId: number) {
        return `gameQuestions:${questionId}:totalPlayers`
    }

    // set used to keep track of who hasn't answered yet
    static haveNotAnswered(questionId: number) {
        return `gameQuestions:${questionId}:haveNotAnswered`;
    }

    // only used socket server side during score calculation
    static haveAnswered(questionId: number) {
        return `gameQuestions:${questionId}:haveAnswered`;
    }

    static answerIdsForPlayer(playerId: number) {
        return `players:${playerId}:answerIds`;
    }

}

export default Keys;