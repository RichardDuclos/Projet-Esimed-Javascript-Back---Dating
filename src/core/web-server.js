const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user-routes');
const authRoutes = require('../controllers/auth-routes');
const personRoutes = require('../controllers/person-routes');
const { sequelize } = require('../models/db');
const bodyParser = require('body-parser');
const e = require('../models/user.models');
const initializeForeignKey = require("../models/foreignkey");
const userRepository = require('../models/user-repository');
const personRepository = require('../models/person-repository');

class WebServer {
    app = undefined;
    port = 3000;
    server = undefined;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json({limit : '50mb'}));
        this.app.use(bodyParser.urlencoded({ extended :true}));
        this.syncDb();

        initializeConfigMiddlewares(this.app);
        this._initializeRoutes();
        initializeErrorMiddlwares(this.app);
    }

    async syncDb() {
        await initializeForeignKey();
        await sequelize.sync({alter : true/*force: true*/});
        //await userRepository.Seed();
        //await personRepository.Seed();
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
        this.app.use('/auth', authRoutes.initializeRoutes());
        this.app.use('/persons', personRoutes.initializeRoutes());
    }
}

module.exports = WebServer;
