import { GameQuestionStatus, GameStatus, PlayerRef } from "@whosaidtrue/app-interfaces";

export interface WebsocketMessage {
  event: string,
  status?: string,
  debug?: string,
  payload?: Record<string, unknown>,
}

export interface WebsocketError extends WebsocketMessage {
  event: string,
  status: 'fail',
  payload: {
    error_message: string,
    [key: string]: unknown,
  }
}

export interface PlayerJoinedGame extends WebsocketMessage {
  event: 'PlayerJoinedGame'
  payload: {
    id: number;
    player_name: string;
  },
}

export interface PlayerLeftGame extends WebsocketMessage {
  event: 'PlayerLeftGame';
  payload: {
    id: number;
    player_name: string;
  },
}


// Host sends this. Rebroadcast to all clients to trigger
// appropriate client side response.
export interface RemovePlayer extends WebsocketMessage {
  event: 'RemovePlayer',
  payload: {
    id: number;
    player_name: string;
  },
}

export interface UpdateInactivePlayers extends WebsocketMessage {
  event: 'UpdateInactivePlayers';
  payload: { inactivePlayers: PlayerRef[] }
}

export interface UpdateDisconnectedPlayers extends WebsocketMessage {
  event: 'UpdateDisconnectedPlayers';
  payload: { disconnectedPlayers: PlayerRef[] }
}

export interface SetQuestionResult extends WebsocketMessage {
  event: 'SetQuestionResult';
  payload: {
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];
    correctAnswer: number
  }
}

// DEV_NOTE: SetQuestionState event takes care of this
// export interface NextQuestion extends WebsocketMessage {
//   event: 'NextQuestion',
// }

export interface AnswerPart1 extends WebsocketMessage {
  event: 'AnswerPart1',
  payload: {
    questionId: number;
    answer: boolean;
  }
}

export interface AnswerPart2 extends WebsocketMessage {
  event: 'AnswerPart2',
  payload: {
    questionId: number;
    guess: number;
  }
}

export interface SetQuestionState extends WebsocketMessage {
  event: 'SetQuestionState';
  payload: {
    id: number;
    status: GameQuestionStatus;
    primaryText: string;
    followUp: string;
    secondaryText: string;
    sequenceIndex: number;
    answersPending: number;
    readerName: string;
    readerId: number;
  }

}

export interface GameStateUpdate extends WebsocketMessage {
  event: 'GameStateUpdate'
  payload: {
    game_id: number;
    access_code: string;
    status: GameStatus;
    players: PlayerRef[];
    inactivePlayers: PlayerRef[];
    disconnectedPlayers: PlayerRef[];
    totalQuestions: number;
  }
}

export interface UpdateAnswersPending extends WebsocketMessage {
  event: 'UpdateAnswersPending';
  payload: {
    answersPending: number;
  }
}

/**
 * Sent by host when they take over as reader. Rebroadcast to all connected clients
 */
export interface SetReader extends WebsocketMessage {
  event: 'SetReader',
  payload: {
    playerId: number;
    playerName: string;
  }
}

export interface SetGameResults extends WebsocketMessage {
  event: 'SetGameResults',
  payload: {
    winner: string;
    funFacts: FunFact[];
    results: PlayerScore[];
  }
}

// export interface ResultState extends WebsocketMessage {
//   payload: {
//     question_number: number,
//     question_total: number,

//     result: number,
//     result_text: string,
//     follow_up_text: string,

//     your_group_percent: number,
//     all_players_percent: number,
//   }
// }

// export interface ScoreState extends WebsocketMessage {
//   payload: {
//     question_number: number,
//     question_total: number,
//     player_guess: number,
//     correct_answer: number,
//     scoreboard: PlayerScore[],
//     fun_facts?: FunFact[],    // final scores
//   }
// }

export interface PlayerScore {
  player_id: number,
  player_name: string,
  current_rank: number,
  current_score: number,
  previous_rank: number,
  previous_score: number,
}

export interface FunFact {
  title: string,
  subtitle: string,
  body: {
    text?: string,
    your_group_percent?: number,
    all_players_percent?: number,
  }
}
