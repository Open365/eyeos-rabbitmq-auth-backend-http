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

'use strict';

var child_process = require('child_process');
var path = require('path');
var http = require('http');
var util = require('util');
var querystring = require('querystring');
var assert = require('chai').assert;
var settings = require('../src/settings');

describe('RabbitMQ Integration tests', function () {
	var serverProcess;
	var testBindAddress = '127.0.0.1';
	var testPort = settings.port;
	var basePath = '/rabbitmq/auth';
	var baseUrl = util.format('http://%s:%d%s', testBindAddress, testPort, basePath);
	var userAuthUrl = baseUrl + '/user';
	var vhostAuthUrl = baseUrl + '/vhost';
	var resourceAuthUrl = baseUrl + '/resource';

	// used to tell if the port has been opened or not and then abort the
	// rest of tests
	var portOpened = false;

	/**
	 * 'before' hook is executed only once at the beginning of all tests.
	 */
	before(function (done) {
		console.log('running before');
		serverProcess = child_process.spawn(
			process.execPath,
			[path.join(__dirname, '..', 'src', 'eyeos-rabbitmq-auth-backend-http.js')],
			{
				env: {
					EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_PORT: testPort,
					EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_BIND_ADDRESS: testBindAddress
				},
				stdio: 'inherit'
			}
		);
		checkPortOpened(done, 500);

	});

	/**
	 * 'after' hook is executed only once at the end of all tests.
	 */
	after(function () {
		console.log('running after');
		serverProcess.kill();
	});

	/**
	 * helper function called from the 'before' hook, to see if the port has
	 * been opened and we can launch all the tests
	 */
	function checkPortOpened (done, maxTime) {
		var timeoutId;
		var _internalCheckPortOpened = function (done) {
			var req = http.get(
				'http://' + testBindAddress + ':' + testPort + '/',
				function (res) {
					console.log('port opened');
					portOpened = true;
					done();
				}
			);

			req.on('error', function () {
				console.log('port closed');
				timeoutId = setTimeout(function () {
					_internalCheckPortOpened(done);
				}, 100);
			});
		};

		timeoutId = setTimeout(function () {
			_internalCheckPortOpened(done);
		}, 100);

		setTimeout(function () {
			if (!portOpened) {
				console.error("Port has not been opened in %sms, aborting.", maxTime);
				process.exit(1);
			}
		}, maxTime);
	}

	function appendGetParamsToUrl (url, params) {
		return url + '?' + querystring.stringify(params);
	}

	function testApiPointResponse (done, expectedBody, urlWithParams, assertionMessage) {
		var req = http.get(urlWithParams, function (res) {
			var responseBody = '';
			assert.equal(200, res.statusCode, 'Response status code should be 200');
			res.on('data', function (chunk) {
				responseBody += chunk;
			});
			res.on('end', function () {
				assert.equal(responseBody, expectedBody, assertionMessage);
				done();
			});
		});
	}

	it('should return correct auth response when any user access / vhost', function (done) {
		var params = {
			username: 'guest',
			vhost: '/'
		};

		var url = appendGetParamsToUrl(vhostAuthUrl, params);

		testApiPointResponse(done, 'allow', url, 'Response body should be "allow"');
	});

	it('should return correct auth response when any user access any resource', function (done) {
		var params = {
			username: 'fakeusername',
			vhost: 'fakevhost',
			name: 'fakename',
			resource: 'queue',
			permission: 'read'
		};

		var url = appendGetParamsToUrl(resourceAuthUrl, params);

		testApiPointResponse(done, 'allow', url, 'Response body should be "allow"');
	});
});
