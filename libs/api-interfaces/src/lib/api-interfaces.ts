import { Deck } from '@whosaidtrue/app-interfaces';

export interface TokenPayload {
  id: number;
  email: string;
  roles: string[];
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

export interface UpdateAccountRequest {
  notifications: boolean
}

export interface NameObject {
  name: string;
  id: number;
  clean: boolean
}
export interface NameRequestResponse {
  names: NameObject[];
}

export interface CreateGameDecksResponse {
  ownedDecks: Partial<Deck>[];
  unownedDecks: Partial<Deck>[];
}