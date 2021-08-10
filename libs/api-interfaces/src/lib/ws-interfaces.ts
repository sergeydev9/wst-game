export interface WebsocketMessage {
  event: string;
  status: string;
  debug?: string;
  payload?: Record<string, unknown>;
}

export interface WebsocketError extends WebsocketMessage {
  event: string;
  status: 'fail';
  payload: {
    errorMessage: string;
    [key: string]: unknown;
  }
}

export interface PlayerJoinGame extends WebsocketMessage {
  event: 'PlayerJoinGame';
  payload: {
    playerName: string;
  };
}

export interface PlayerJoinedGame extends WebsocketMessage {
  event: 'PlayerJoinedGame';
}

export interface HostJoinGame extends WebsocketMessage {
  event: 'HostJoinGame';
  payload: {
    playerName: string;
  };
}

export interface HostJoinedGame extends WebsocketMessage {
  event: 'HostJoinedGame';
}

export interface PlayerLeftGame extends WebsocketMessage {
  event: 'PlayerLeftGame';
  payload: {
    playerName: string;
  };
}

export interface HostLeftGame extends WebsocketMessage {
  event: 'HostLeftGame';
}

export interface NextQuestion extends WebsocketMessage {
  event: 'NextQuestion';
}

export interface SkipQuestion extends WebsocketMessage {
  event: 'SkipQuestion';
}

export interface QuestionPart1 extends WebsocketMessage {
  event: 'QuestionPart1';
}

export interface AnswerPart1 extends WebsocketMessage {
  event: 'AnswerPart1';
}

export interface QuestionPart2 extends WebsocketMessage {
  event: 'QuestionPart2';
}

export interface AnswerPart2 extends WebsocketMessage {
  event: 'AnswerPart2';
}

export interface PlayerAnswered extends WebsocketMessage {
  event: 'PlayerAnswered';
}

export interface QuestionResults extends WebsocketMessage {
  event: 'QuestionResults';
}

export interface QuestionScores extends WebsocketMessage {
  event: 'QuestionScores';
}

export interface FinalScores extends WebsocketMessage {
  event: 'FinalScores';
}

export interface RemovePlayer extends WebsocketMessage {
  event: 'RemovePlayer';
}
