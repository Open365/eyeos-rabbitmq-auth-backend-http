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

var sinon = require('sinon'),
    assert = require('chai').assert,
    ExchangeValidator = require('../lib/validator/exchange-validator');

suite('ExchangeValidator', function(){
	suite('disabled true', function(){
        var sut;

        setup(function() {
            var settings = {
                disabled: true,
                masterUser: "guest"
            };
            sut = new ExchangeValidator(settings);
        });

        teardown(function() {
        });

        test('when is disabled never throws an error', function(done) {
            sut.validate('hi', function(err, result) {
                assert.isNull(err);
                done();
            });
        });

        test('when is disabled always return allow', function(done) {
            sut.validate('hi', function(err, result) {
                assert.equal(result, 'allow');
                done();
            });
        });
    });

    suite('user is master user', function(){
        var sut;
        var user;
        var params;

        setup(function() {
            var user = "guest";
            var settings = {
                disabled: false,
                masterUser: user
            };
            params = {
                username: user
            }
            sut = new ExchangeValidator(settings);
        });

        teardown(function() {
        });

        test('when user is master user never throws an error', function(done) {
            sut.validate(params, function(err, result) {
                assert.isNull(err);
                done();
            });
        });

        test('when user is master user always return allow', function(done) {
            sut.validate(params, function(err, result) {
                assert.equal(result, 'allow');
                done();
            });
        });
    });

    suite('regular user queues', function(){
        var sut;
        var user;
        var params;

        setup(function() {
            var user = "guest";
            var settings = {
                disabled: false,
                masterUser: user
            };
            sut = new ExchangeValidator(settings);
        });

        teardown(function() {
        });
        var goodCases = [
            {
                name:"user_username@domain",
                username: JSON.stringify({username: "username", domain: "domain"})
            },
            {
                name:"user_username@domain",
                username: "username@domain"
            },
            {
                name:"user_username_with_underscores@domain",
                username: JSON.stringify({username: "username_with_underscores", domain: "domain"})
            },
            {
                name:"user_username@domain_app_132453452346354",
                username: JSON.stringify({username: "username", domain: "domain"})
            },
            {
                name:"user_username_with_underscores@domain_app_32439843529387635",
                username: JSON.stringify({username: "username_with_underscores", domain: "domain"})
            }
        ];

        goodCases.forEach(function(variant) {
            test('when ' + JSON.stringify(variant) + ' does not return an error', function(done) {
                sut.validate(variant, function(err, result) {
                    assert.isNull(err);
                    done();
                });
            });
            test('when ' + JSON.stringify(variant) + ' always return allow', function(done) {
                sut.validate(variant, function (err, result) {
                    assert.equal(result, 'allow');
                    done();
                });
            });
        });

        var badCases = [
            {
                name:"user_username@domain",
                username: JSON.stringify({username: "otherUsername", domain: "domain"}),
                reason: "user does not own this queue"
            },
            {
                name:"bad_queue_name",
                username: JSON.stringify({username: "username", domain: "domain"}),
                reason: "queue does not start with user_"
            },
            {
                name:"user_username@domain",
                username: [],
                reason: "Username is neither a string nor a card"
            }
        ];

        badCases.forEach(function(variant) {
            test('when ' + JSON.stringify(variant) + ' returns an error', function(done) {
                sut.validate(variant, function(err, result) {
                    assert.isNotNull(err);
                    done();
                });
            });
        });
    });

});



