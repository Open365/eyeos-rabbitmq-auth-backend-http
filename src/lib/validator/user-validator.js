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

var settings = require('../../settings');
var EyeosAuth = require('eyeos-auth');
var log2out = require('log2out');


var UserValidator = function(eyeosAuth) {
    this.eyeosAuth = eyeosAuth || new EyeosAuth();
    this.logger= log2out.getLogger('UserValidator');
};

UserValidator.prototype.validate = function(params, callback) {
    if (settings.disabled) {
        this.logger.info('All users authorized');
        authorized = true;
    } else if (params.password === settings.masterPassword) {
        this.logger.info('validating with master password');
        authorized = true;
    } else if (params.username[0] === '{') {
        this.logger.info('validating with minicard and minisignature');
        var authorized = this.eyeosAuth.verifyRequestWithMini({
            headers: {
                minicard: params.username,
                minisignature: params.password
            }
        });
    }

    if (authorized) {
        callback(null, {username: params.username});
    } else {
        var msg = 'Unauthorized bus user';
        this.logger.error(msg);
        callback(new Error(msg));
    }
};

module.exports = UserValidator;
