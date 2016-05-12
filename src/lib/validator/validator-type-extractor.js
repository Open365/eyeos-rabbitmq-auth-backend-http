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

var ValidatorTypeExtractor = function() {
    this.logger= log2out.getLogger('ValidatorTypeExtractor');
};

ValidatorTypeExtractor.prototype.getValidatorType = function(params) {
    var result = null;
    if (params.password) {
        result = 'user';
    } else if (params.vhost === '/' && !params.resource) {
        result = 'empty';
    } else if (params.resource === 'queue') {
        result = 'empty';
    } else if (params.resource === 'exchange') {
        result = 'exchange';
    }
    return result;
};

module.exports = ValidatorTypeExtractor;
