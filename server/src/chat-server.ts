import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
var fs = require('fs');


import { Message } from './model/message.model';

export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Client trying to access server on port %s.', this.port);

            socket.on('challenge', (csr) => {
                console.log('Recieved valid CSR from client ... \n',csr);
                console.log('\n Issueing Certificate to client ... \n');
                console.log(`Current directory: ${process.cwd()}`);

                let cert = fs.readFileSync('../pki/X509Certificate.crt', 'utf8');

                this.io.emit('cert', cert.toString());
            });

            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}