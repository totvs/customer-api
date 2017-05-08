"use strict";
var logger = require('./lib/logger');
var config = require('./config.json');
var express = require('express');
var bodyParser = require('body-parser');
var Customer = require('./models/customer.model');
var customerRouter = require('./routes/customer.router');
var router = express.Router();
var app = express();

function initRestServer() {
    logger.info("Initializing Rest Server");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(function (req, res, next) {
        logger.info('Rest ' + req.method + ' Request on ' + req.originalUrl);
        next();
    });

    app.use('/customer', customerRouter);

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
    initDB();
    initRestServer();
}

init();