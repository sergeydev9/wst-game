import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send("WhoSaidTrue Socket Server v1.0");
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
