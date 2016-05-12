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

var log2out = require('log2out'),
    ValidatorRouter = require('./validator/validator-router.js');

function AuthService (validator, logger) {
    this.validatorRouter = validator || new ValidatorRouter();
    this.logger = logger || log2out.getLogger('rabbit-auth-service');
}

AuthService.prototype = {
	getUserAuthentication: function getUserAuthentication(username, password, res ,next) {
        var self = this;
        var params = {
            'username': username,
            'password': password
        };

        this.validatorRouter.validateAuth(params, function validateUserAuthCallback(err, data) {
            var responseBody;
            if (err) {
                self.logger.error('Error processing user auth: ', err);
            }
            if (data && data.username) {
                responseBody = 'allow ' + data.username;
                self.logger.debug("Got auth/user req user=%s responseBody=%s", data.username, responseBody);
                self.sendResponse(res, responseBody, next);
            } else {
                self.logger.warn('User not allowed to connect to rabbitmq');
                responseBody = 'deny';
                self.sendResponse(res, responseBody, next);
            }
        });
	},

	getVhostAuthorization: function getVhostAuthorization(username, vhost, res, next) {
        var self = this;
        var params = {
            username: username,
            vhost: vhost
        };

        this.validatorRouter.validateAuth(params, function(err, responseBody) {
            self.logger.debug("Got auth/vhost req user=%s responseBody=%s", username, responseBody);

            self.sendResponse(res, responseBody, next);
        });
	},

	getResourceAuthorization: function(username, vhost, resource, name, permission, res, next) {
        var self = this;
        var params = {
            username: username,
            vhost: vhost,
            resource: resource,
            name: name,
            permission: permission
        };

        this.validatorRouter.validateAuth(params, function(err, responseBody) {
            self.logger.debug("Got auth/resource req user=%s on %s/%s/%s/%s/ responseBody=%s", username, vhost,
                resource, name, permission, responseBody);

            self.sendResponse(res, responseBody, next);
        });
	},

    sendResponse: function(res, responseBody, next) {
        try {
            res.setHeader('Content-Type', 'text/plain');
            res.status(200);
            res.send(responseBody);
            next();
        } catch (err) {
            this.logger.error('Error sending response: ', err);
        }
    }
};

module.exports = AuthService;
