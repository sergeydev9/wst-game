import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as morgan from 'morgan';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import DB from './db';
import { errorHandler } from '@whosaidtrue/middleware';
import { logger, stream } from '@whosaidtrue/logger';

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(routes: express.Router[]) {
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.env = process.env.NODE_ENV || 'development';

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    public getServer() {
        return this.app;
    }

    private connectToDatabase() {
        DB.sequelize.sync({ force: false });
    }

    private initializeMiddlewares() {
        if (this.env === 'production') {
            this.app.use(morgan('combined', { stream }));
            this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
        } else {
            this.app.use(morgan('dev', { stream }));
            this.app.use(cors({ origin: true, credentials: true }));
        }

        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private initializeRoutes(routes: express.Router[]) {
        routes.forEach(route => {
            this.app.use('/', route);
        });
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Backend api docs',
                },
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    private initializeErrorHandling() {
        this.app.use(errorHandler);
    }
}

export default App;