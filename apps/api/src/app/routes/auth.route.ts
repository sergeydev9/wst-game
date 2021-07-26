import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { CreateUserDto } from '@whosaidtrue/middleware';
import authMiddleware from '../auth.middleware';
import { validationMiddleware } from '@whosaidtrue/middleware';

class AuthRoute {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
