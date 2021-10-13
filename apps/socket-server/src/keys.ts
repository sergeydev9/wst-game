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

    constructor(socket: Socket) {
        this.gameKey = `games:${socket.gameId}`;
        this.playerKey = `players:${socket.playerId}`;
        this.currentPlayers = `${this.gameKey}:currentPlayers`;
        this.removedPlayers = `${this.gameKey}:removed`;
        this.gameStatus = `${this.gameKey}:status`;
        this.readerList = `${this.gameKey}:readers`;
        this.currentQuestion = `${this.gameKey}:currentQuestion`;
        this.answerIds = `${this.playerKey}:answerIds`;
        this.hasPassed = `${this.playerKey}:hasPassed`;
        this.totalQuestions = `${this.gameKey}:totalQuestions`;
        this.currentSequenceIndex = `${this.gameKey}:currentSequenceIndex`;
    }
}

export default Keys;