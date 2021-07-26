import { User } from '@whosaidtrue/data'
import { Request } from 'express';

export interface Message {
  message: string;
}

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  jwt: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
