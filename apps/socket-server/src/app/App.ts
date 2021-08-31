import express from 'express';
import expressWs from 'express-ws';
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import { logger } from '@whosaidtrue/logger';

class App {
    private readonly wss = expressWs(express());
    private readonly app =  this.wss.app;
    private readonly port = process.env.PORT || 4001;

    constructor() {
        this.initializeMiddlewares();
    }

    public initializeRoutes(routes: express.Router[]) {
        routes.forEach(route => {
            this.app.use('/', route);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors({ origin: process.env.DOMAIN || true, credentials: true }));
        this.app.use(hpp());
        this.app.use(helmet());
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${process.env.NODE_ENV} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

}

export default App;
