export interface WebsocketMessage {
  event: string,
  status: string,
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
    player_name: string,
    is_host: boolean,
  },
}

export interface PlayerLeftGame extends WebsocketMessage {
  event: 'PlayerLeftGame',
  payload: {
    player_name: string,
    is_host: boolean,
  },
}

export interface NextQuestion extends WebsocketMessage {
  event: 'NextQuestion',
}

export interface AnswerPart1 extends WebsocketMessage {
  event: 'AnswerPart1',
  payload: {
    question_number: number;
    answer: boolean;
  }
}

export interface AnswerPart2 extends WebsocketMessage {
  event: 'AnswerPart2',
  payload: {
    question_number: number;
    guess: number;
  }
}

export interface QuestionState extends WebsocketMessage {
  payload: {
    question_id: number,
    status: string,
    primary_text: string,
    secondary_text: string,
    question_sequence_index: number,
    number_pending_answers: number,
    reader_name: string,
  }

}

export interface GameState extends WebsocketMessage {
  payload: {
    game_id: number,
    host_id: number,
    host_player_id: number,
    status: string,
    current_players: string[],
    total_questions: number,
    current_question: number,
  }
}

export interface ResultState extends WebsocketMessage {
  payload: {
    question_number: number,
    question_total: number,

    result: number,
    result_text: string,
    follow_up_text: string,

    your_group_percent: number,
    all_players_percent: number,
  }
}

export interface ScoreState extends WebsocketMessage {
  payload: {
    question_number: number,
    question_total: number,
    player_guess: number,
    correct_answer: number,
    scoreboard: PlayerScore[],
    fun_facts?: FunFact[],    // final scores
  }
}

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
