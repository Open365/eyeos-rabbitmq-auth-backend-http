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
var settings = require('../../settings');

var ExchangeValidator = function() {
    this.logger= log2out.getLogger('ExchangeValidator');
};

ExchangeValidator.prototype.validate = function(params, callback) {
    var exchangename;
    if (params.username[0] === '{') {
        var card = JSON.parse(params.username);
        exchangename = card.username + '@' + card.domain;
    } else {
        exchangename = params.username[0] === '{' ? JSON.parse(params.username).username : params.username;
    }
    var name = params.name;
    var validate = false;
    var parts = name.split('_');

    if (settings.disabled) {
        validate = true;
    } else if (parts[1] === exchangename && parts[0] === 'user') {
        validate = true;
    } else if (exchangename === settings.masterUser) {
        validate = true;
    }

    if (validate) {
        callback(null, 'allow');
    } else {
        callback(new Error('Unauthorized user'));
    }
};

module.exports = ExchangeValidator;
