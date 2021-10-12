import { Socket } from 'socket.io';

export class Keys {
    public readonly gameKey: string;
    public readonly playerKey: string;
    public readonly questionKey: string;
    public readonly currentPlayers: string;
    public readonly gameStatus: string;
    public readonly removedPlayers: string;
    public readonly readerList: string;
    public readonly currentQuestion: string; // question data
    public readonly answerIds: string;
    public readonly hasPassed: string;

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
    }
}

export default Keys;