import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { user, healthcheck, decks, names, purchase, games, ratings, oneLiners, emails } from './routes';
import { logger } from '@whosaidtrue/logger';

// TODO: Make it crash if it can't connect to database
class App {
    public readonly app = express();
    private readonly port = process.env.PORT || 3000;

    constructor() {
        this.initializeMiddlewares();
        this.initializeRoutes();

        if (process.env.NODE_ENV === 'development') {
            this.initializeSwagger();
        }
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${process.env.NODE_ENV} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors({ origin: [process.env.DOMAIN, process.env.FOR_SCHOOLS_DOMAIN] || true, credentials: true }));
        this.app.use(hpp());
        this.app.use(helmet());
    }

    private initializeRoutes() {
        this.app.use('/purchase', purchase)
        this.app.use(express.json()); // this iddleware needs to come after purchase route because of webhook signatures

        this.app.use('/healthz', healthcheck)
        this.app.use('/user', user)
        this.app.use('/decks', decks)
        this.app.use('/names', names)
        this.app.use('/games', games)
        this.app.use('/ratings', ratings)
        this.app.use('/one-liners', oneLiners)
        this.app.use('/emails', emails)
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'Who said true? API',
                    version: '1.0.0',
                    description: 'Backend api docs',
                },
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }
}

export default App;