'use strict';

var path = require('path'),
    _ = require('lodash-node'),
    mercury,
    winston = require('winston');

function Mercury() {
    this.mainPath = path.dirname(require.main.filename);
    this.config = _.extend(
        require('../mercury'),
        require(this.mainPath + '/mercury')
    );

    this.modules = [];
}

Mercury.prototype.start = function () {
    this.express.start();
};

Mercury.prototype.addModule = function (module) {
    this.modules.push(module);
};

mercury = new Mercury();

module.exports = mercury;

mercury.Module = require('./core/module');
mercury.Router = require('./core/router');
mercury.Socket = require('./core/socket');
mercury.express = require('./servers/express');
mercury.io = require('./servers/socket.io');
mercury.Repository = require('./core/repository');
mercury.db = require('./servers/db');

var winstonLogger,
    transports = [];

if (mercury.config.logs) {
    _.each((mercury.config.logs.file || []), function (level, filename) {
        transports.push(new winston.transports.File({ filename: mercury.mainPath + '/' + filename, level: level }));
    });
}

if (transports.length === 0) {
    transports.push(new winston.transports.Console({ level: 'silly' }));
}

winstonLogger = new winston.Logger({
    transports: transports
});

mercury.logger = winstonLogger;
