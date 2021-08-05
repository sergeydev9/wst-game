import { Router } from 'express';
import IndexController from '../controllers/index.controller';

class IndexRoute {
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, this.indexController.index);
  }
}

export default IndexRoute;
