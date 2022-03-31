const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user-routes');
const authRoutes = require('../controllers/auth-routes');
const { sequelize } = require('../models/db');
const e = require('../models/user.models');
class WebServer {
    app = undefined;
    port = 3000;
    server = undefined;

    constructor() {
        this.app = express();
        this.syncDb();

        initializeConfigMiddlewares(this.app);
        this._initializeRoutes();
        initializeErrorMiddlwares(this.app);
    }

    async syncDb() {
        await sequelize.sync();

    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

    stop() {
        this.server.close();
    }
    _initializeRoutes() {
        this.app.use('/users', userRoutes.initializeRoutes());
        this.app.use('/', authRoutes.initializeRoutes());
    }
}

module.exports = WebServer;
