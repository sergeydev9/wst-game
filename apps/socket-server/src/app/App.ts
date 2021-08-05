import * as express from 'express';
import * as expressWs from 'express-ws';

import * as helmet from "helmet";
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as hpp from 'hpp';
import * as morgan from 'morgan';

import {logger, stream} from "@whosaidtrue/logger";


class App {
    private readonly wss: expressWs.Instance;
    private readonly app: expressWs.Application;

    private readonly port: string | number;
    private readonly env: string;

    constructor() {
        this.wss = expressWs(express());
        this.app = this.wss.app;
        this.port = process.env.PORT || 4001;
        this.env = process.env.NODE_ENV || 'development';

        this.initializeMiddlewares();
    }

    public initializeRoutes(routes: express.Router[]) {
        routes.forEach(route => {
            this.app.use('/', route);
        });
    }

    private initializeMiddlewares() {
        if (this.env === 'production') {
            this.app.use(morgan('combined', {stream}));
            this.app.use(cors({origin: 'your.domain.com', credentials: true}));
        } else {
            this.app.use(morgan('dev', {stream}));
            this.app.use(cors({origin: true, credentials: true}));
        }

        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cookieParser());
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 Socket Server listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

}

export default App;
