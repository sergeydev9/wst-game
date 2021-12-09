import {
  AnswerValue,
  GameQuestionStatus,
  GameStatus,
  PlayerRef,
  ScoreboardEntry,
  GroupComparison,
} from '@whosaidtrue/app-interfaces';

export interface SetCurrentPlayers {
  players: PlayerRef[];
}

// e.g. PlayerLeftGame, PlayerJoinedgame, RemovePlayer
export interface PlayerEvent {
  id: number;
  player_name: string;
  event_origin?: string; // used to identify where this was trigged. e.g. if player was removed from the lobby, this string will indicate that
}

export interface UpdateInactivePlayers {
  inactivePlayers: PlayerRef[];
}

export interface UpdateDisconnectedPlayers {
  disconnectedPlayers: PlayerRef[];
}

export interface QuestionEnd {
  groupTrue: number;
  pointsEarned: Record<string, string>;
  scores: ScoreboardEntry[];
  correctAnswer: number;
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
  gameQuestionId: number;
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

export type SetHaveNotAnswered = PlayerRef[];

export interface FunFacts {
  bucketList: GroupComparison;
  groupVworld: GroupComparison;
}

export interface FetchMostSimilar {
  numSameAnswer: number;
  name: string;
  groupMostSimilarNames: string;
  groupMostSimilarNumber: number;
}
