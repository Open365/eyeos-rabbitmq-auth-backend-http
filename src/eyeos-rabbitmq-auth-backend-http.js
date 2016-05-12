#!/usr/bin/env node
/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

// rabbitmq-auth-backend-http provides an authorization and authorization mechanism
// via HTTP for RabbitMQ

// external requires
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var log2out = require('log2out');
var Notifier = require('eyeos-service-ready-notify');

// eyeos requires
var Server = require('./lib/server.js');
var settings = require('./settings.js');

var logger = log2out.getLogger('rabbitmq-auth-backend-http');

logger.info('Current settings are:\n', settings);

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var rabbitmqAuhBackendHttp = new Server();

    logger.info(">>>> Starting rabbitmqAuhBackendHttp in %s:%d",
        settings.bindAddress,
        settings.port
    );

    rabbitmqAuhBackendHttp.start(settings.bindAddress, settings.port);

    var notifier = new Notifier();
    notifier.registerService();
}
