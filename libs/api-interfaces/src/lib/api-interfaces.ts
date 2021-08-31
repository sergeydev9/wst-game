import { Deck, NameObject } from '@whosaidtrue/app-interfaces';

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
  userId: number,
}