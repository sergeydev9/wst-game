import { Socket } from 'socket.io';

export class Keys {
    public readonly gameKey: string;
    public readonly currentPlayers: string;
    public readonly gameStatus: string;
    public readonly removedPlayers: string;
    public readonly readerList: string;
    public readonly currentQuestion: string;

    constructor(socket: Socket) {
        this.gameKey = `games:${socket.gameId}`;
        this.currentPlayers = `${this.gameKey}:currentPlayers`;
        this.removedPlayers = `${this.gameKey}:removed`;
        this.gameStatus = `${this.gameKey}:status`;
        this.readerList = `${this.gameKey}:readers`;
        this.currentQuestion = `${this.gameKey}:currentQuestion`;
    }
}

export default Keys;