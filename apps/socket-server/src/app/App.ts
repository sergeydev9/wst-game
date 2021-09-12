import express, {NextFunction, Request, Response} from 'express';
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import {logger} from '@whosaidtrue/logger';

import http from 'http';
import {Server, Socket} from "socket.io";
import SocketioService from "./services/socketio.service";
import GameService from "./services/game.service";


class App {
    private readonly app = express();
    private readonly server = http.createServer(this.app);
    private readonly io = new Server(this.server, {
        cors: { // TODO: update for prod
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    private readonly port = process.env.PORT || 4001;

    private readonly gameService = new GameService();
    private readonly socketService = new SocketioService(this.gameService);

    constructor() {
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSocket();
    }

    public initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.send("WhoSaidTrue Socket Server v1.0");
            res.sendStatus(200);
        });
        this.app.get('/test', (req, res) => {
            res.sendFile(__dirname + '/test.html');
        });
    }

    public initializeSocket() {
        this.io.on("connection", async (socket: Socket) => {
            console.log("connection", socket.id);
            await this.socketService.handle(socket);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cookieParser());
        this.app.use(cors({ origin: process.env.DOMAIN || true, credentials: true }));
        this.app.use(hpp());
        this.app.use(helmet());

        //TODO: remove
        if (process.env.NODE_ENV != "production") {
            this.disableSecurityForDevelopment()
        }

        // TODO: implement JWT middleware
        // auth example: https://socket.io/docs/v3/middlewares/
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            console.log("token: ", token);

            socket.data.gameCode = token.game_code;
            socket.data.playerId = token.player_id;

            next();
        });
    }

    private disableSecurityForDevelopment() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const csp = res.getHeader('Content-Security-Policy');
            res.removeHeader('Content-Security-Policy');
            res.setHeader('Content-Security-Policy-Report-Only', csp);
            next();
        });
    }

    public listen() {
        this.server.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${process.env.NODE_ENV} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

}

export default App;
