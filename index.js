"use strict";
var logger = require('./lib/logger');
var config = require('./config.json');
var express = require('express');
var bodyParser = require('body-parser');
var customerRouter = require('./routes/customer.router');
var User = require('./models/user.model');
var userRouter = require('./routes/user.router');
var router = express.Router();
var app = express();

function initRestServer() {
    logger.info("Initializing Rest Server");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(function (req, res, next) {
        logger.info('Rest ' + req.method + ' Request on ' + req.originalUrl);
        next();
    });
    app.use('/api/v1/customers', customerRouter);
    app.use('/api/v1/users', userRouter);

    app.use('/doc', express.static('doc'));

    app.listen(config.restserver.port, function () {
        logger.info('Rest Server started on port ' + config.restserver.port);
    });
}

function initDB() {
    logger.info("Initializing database");
    var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    return mongoose.connect(config.mongodb.url);
}

function init() {
    logger.info('Service started');
    initDB()
        .then(() => {
            initRestServer();
        });
}

init();