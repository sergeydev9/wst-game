import { Deck, NameObject, PlayerRef, GameStatus, MovieRating } from '@whosaidtrue/app-interfaces';

/**
 * user
 */
export interface TokenPayload {
  id: number;
  email: string;
  roles: string[];
}

export interface ChangePassRequest {
  oldPass: string;
  newPass: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AccountDetailsResponse {
  id: number;
  email: string;
  roles: string[];
  notifications: boolean;
  question_deck_credits: number
}

export interface WithEmailBody {
  email: string
}
export interface ResetCodeVerificationRequest {
  code: string;
  email: string;
}

export interface ResetCodeVerificationResponse {
  resetToken: string
}

// last step in password reset process
export interface ResetRequest {
  password: string;
  resetToken: string;
}

/**
 * names
 */
export interface NameRequestResponse {
  names: NameObject[];
}

export interface NameChoiceReport {
  seen: number[];
  chosen: number
}

/**
 * decks
 */
export interface DeckSelectionResponse {
  owned: Deck[];
  notOwned: Deck[];
}

/**
 * games
 */

export interface CreateGameRequest {
  deckId: number,
}

export interface CreateGameResponse {
  game_id: number,
  access_code: string;
}

export interface AccessCodeQuery {
  access_code: string;
}

export interface StatusRequestResponse {
  status: string;
}

export interface JoinGameRequest {
  access_code: string;
  name: string;
}

export interface JoinGameResponse {
  status: GameStatus;
  gameToken: string;
  game_id: number;
  deckName: string;
  deckId: number;
  deckMovieRating: MovieRating;
  deckSFW: boolean;
  deckDescription: string;
  totalQuestions: number;
  currentHostName: string;
  players: PlayerRef[];
  currentQuestionIndex: number;
  access_code: string;
  playerId: number;
  playerName: string;
}

/**
 * orders
 */
export interface BuyWithCreditsRequest {
  deckId: number
}