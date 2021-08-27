import { Deck } from '@whosaidtrue/app-interfaces';

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

export interface UpdateDetailsRequest {
  email: string
}

export interface UpdateDetailsResponse {
  email: string
}

export interface NameObject {
  name: string;
  id: number;
  clean: boolean
}
export interface NameRequestResponse {
  names: NameObject[];
}

export interface DeckSelectionResponse {
  owned: Deck[];
  notOwned: Deck[];
}