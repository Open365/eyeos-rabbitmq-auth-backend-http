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

var settings = require('../settings');
var http = require('http');

var queue = encodeURIComponent('/') + '/' + 'user_eyeos';
http.get({
    host: settings.api.host,
    port: settings.api.port,
    path: settings.api.bindedToQueueResource.replace('{QUEUE}', queue),
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + new Buffer(settings.api.userManager + ':' + settings.api.passwdManager).toString('base64')
    }
}, function(res) {
    var body = '';
    res.on('data', function (chunk) {
        body += chunk;
    });

    res.on('end', function () {
        try {
            var data = JSON.parse(body);
            data.forEach(function(item) {
                console.log('#### source: ', item.source);
                console.log('#### key: ', item.properties_key);
            });
            callback(null, 'allow');
        } catch(err) {
            callback(new Error('Not authorized'));
        }
    });
});
