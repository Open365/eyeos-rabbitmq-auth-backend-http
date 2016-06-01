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

var log2out = require('log2out');
var globalSettings = require('../../settings');

var ExchangeValidator = function(settings) {
    this.logger= log2out.getLogger('ExchangeValidator');
    this.settings= settings || globalSettings;
};

ExchangeValidator.prototype.validate = function(params, callback) {
    var username;
    try {
        var card = JSON.parse(params.username);
        username = card.username + '@' + card.domain;
    } catch(e) {
        username = params.username;
    }
    var name = params.name;

    if (this.settings.disabled || username === this.settings.masterUser) {
        return callback(null, 'allow');
    }

    var match = name.match(/^user_(.*?)(_app_[0-9a-f-]+)?$/);

    if (match !== null && match[1] === username) {
        return callback(null, 'allow');
    }
    callback(new Error('Unauthorized user'));
};

module.exports = ExchangeValidator;
