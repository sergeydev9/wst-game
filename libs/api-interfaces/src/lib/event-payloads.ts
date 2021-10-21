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

export interface QuestionEnd {
    groupTrue: number;
    rankDifferences: Record<string, string>;
    pointsEarned: Record<string, string>;
    scores: string[];
    correctAnswer: number
}

export interface AnswerPart1 {
    gameQuestionId: number;
    answer: AnswerValue;
}

export interface AnswerPart2 {
    gameQuestionId: number;
    guess: number;
}

export interface SetQuestionState {
    questionId: number;
    gameQuestionId: number
    status: GameQuestionStatus;
    text: string;
    followUp: string;
    textForGuess: string;
    category: string;
    sequenceIndex: number;
    numPlayers: number;
    globalTrue: number;
    haveNotAnswered: PlayerRef[];
    readerName: string;
    readerId: number;
}

export interface QuestionSkip {
    gameQuestionId: number;
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

export interface SetHaveNotAnswered {
    haveNotAnswered: PlayerRef[];
}

export interface SetGameResults {
    winner: string;
    results: PlayerScore[];
}