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

var restify = require('restify');
var log2out = require('log2out');
var util = require('util');

var AuthService = require('./rabbitmq-auth-service.js');

function Server (logger) {
	this.logger = logger || log2out.getLogger('server');
}

Server.prototype = {
	start: function start (ip, port) {
		var self = this;

		if (!ip || !port) {
			var errMessage = util.format('ip and port are mandatory. Got ip "%s" and port "%s"',
				ip,
				port
			);
			self.logger.error(errMessage);
			throw new Error(errMessage);
		}

		var authService = new AuthService();
		var restifyServer = restify.createServer();

		restifyServer.use(restify.queryParser());

		restifyServer.get('/rabbitmq/auth/user', function handleUserAuthReq (req, res, next) {
			var username = req.params.username;
			var password = req.params.password;

            authService.getUserAuthentication(username, password, res, next);
		});

		restifyServer.get('/rabbitmq/auth/vhost', function handleVhostAuthReq (req, res, next) {
			var username = req.params.username;
			var vhost = req.params.vhost;

			authService.getVhostAuthorization(username, vhost, res, next);
		});

		restifyServer.get('/rabbitmq/auth/resource', function handleResourceAuthReq (req, res, next) {
			var username = req.params.username;
			var vhost = req.params.vhost;
			var resource = req.params.resource;
			var name = req.params.name;
			var permission = req.params.permission;

			authService.getResourceAuthorization(username, vhost, resource, name, permission, res, next);
		});

		restifyServer.listen(port, ip, function () {
			console.log('%s listening at %s',
				restifyServer.name, restifyServer.url)
		});
	}
};

module.exports = Server;
