import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes';

import './database/index';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(cors());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}
module.exports = new App().server;
