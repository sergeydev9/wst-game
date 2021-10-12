import { AnswerValue, GameQuestionStatus, GameStatus, PlayerRef } from "@whosaidtrue/app-interfaces";

export interface SetCurrentPlayers {
    players: PlayerRef[]
}
export interface PlayerScore {
    player_id: number,
    player_name: string,
    current_rank: number,
    current_score: number,
    previous_rank: number,
    previous_score: number,
}

// e.g. PlayerLeftGame, PlayerJoinedgame, RemovePlayer
export interface PlayerEvent {
    id: number;
    player_name: string;
}


export interface UpdateInactivePlayers {
    inactivePlayers: PlayerRef[];
}

export interface UpdateDisconnectedPlayers {
    disconnectedPlayers: PlayerRef[]
}

export interface SetQuestionResult {
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];
    correctAnswer: number
}

export interface AnswerPart1 {
    gameQuestionId: number;
    answer: AnswerValue;
}

export interface AnswerPart2 {
    questionId: number;
    guess: number;
}

export interface SetQuestionState {
    questionId: number;
    gameQuestionId: number
    status: GameQuestionStatus;
    text: string;
    followUp: string;
    textForGuess: string;
    sequenceIndex: number;
    numPlayers: number;
    haveNotAnswered: PlayerRef[];
    readerName: string;
    readerId: number;
}

export interface SetGameState {
    game_id: number;
    access_code: string;
    status: GameStatus;
    players: PlayerRef[];
    inactivePlayers: PlayerRef[];
    disconnectedPlayers: PlayerRef[];
    totalQuestions: number;
}

export interface UpdateAnswersPending {
    answersPending: number;
}

export interface SetGameResults {
    winner: string;
    results: PlayerScore[];
}