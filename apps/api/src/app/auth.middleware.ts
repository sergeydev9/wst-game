import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DB from './db';
import { HttpException } from '@whosaidtrue/app-interfaces';
import { DataStoredInToken, RequestWithUser } from '@whosaidtrue/api-interfaces';

// TODO: rewrite this entirely. Should not have DB call. Remove DB call and move this to the middleware lib.
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (Authorization) {
      const secretKey: string = process.env.JWT_SECRET;
      const verificationResponse = jwt.verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.id;

      // TODO: remove this DB call. The whole point of having JWT tokens is so you don't have to do this call to the DB on every request.
      const findUser = await DB.Users.findByPk(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
