import express, {NextFunction, Request, Response} from 'express';
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import {logger} from '@whosaidtrue/logger';

import http from 'http';
import {Server, Socket} from "socket.io";
import {ExtendedError} from "socket.io/dist/namespace";


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

    constructor() {
        this.initializeMiddlewares();
        this.initializeSocket();
    }

    public initializeRoutes(routes: express.Router[]) {
        routes.forEach(route => {
            this.app.use('/', route);
        });
    }

    public initializeSocket() {
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        // auth example: https://socket.io/docs/v3/middlewares/
        this.io.use((socket, next) => {
            const jwtToken = socket.handshake.auth.jwtToken;
            console.log("jwtToken: ", jwtToken);

            let err: ExtendedError;
            if (jwtToken != 'abc.123.def') {
                console.log("error");
                err = new Error("not authorized") as ExtendedError;
                err.data = { content: "Please retry later" }; // additional details
            }

            next(err);
        });

        this.io.on("connection", (socket: Socket) => {
            socket.on('chat message', (msg) => {
                console.log('message: ' + msg);
                this.io.emit('chat message', msg);
            });
            socket.onAny((event, ...args) => {
                console.log(event, args);
            });
            socket.on("error", (err) => {
                console.log("error", err);
            });
            socket.conn.on("upgrade", () => {
                console.log("upgrade", socket.id);
            });
            socket.on("disconnecting", (reason) => {
                console.log("disconnecting", reason);
            });
            socket.on("disconnect", (reason) => {
                console.log("disconnect", reason);
            });
            socket.on("connect", (reason) => {
                console.log("connect", reason);
            });
            socket.on("connect_error", (reason) => {
                console.log("connect_error", reason);
            });
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
