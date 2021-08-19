import { Deck } from '@whosaidtrue/app-interfaces';

export interface TokenPayload {
  id: number;
  email: string;
  roles: string[];
  notifications: boolean;
}

export interface AuthenticationResponse {
  token: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface GetDecksResponse {
  ownedDecks: Partial<Deck>[];
  unownedDecks: Partial<Deck>[];
}