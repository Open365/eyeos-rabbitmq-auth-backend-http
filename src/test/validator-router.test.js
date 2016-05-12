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
    ValidatorRouter = require('../lib/validator/validator-router.js'),
    ValidatorFactory = require('../lib/validator/validator-factory.js'),
    UserTypeExtractor = require('../lib/validator/validator-type-extractor.js');

suite.skip('ValidatorRouter', function(){
	var sut, paramsTypeVM, wrongParams, paramsTypeUserPush, paramsTypeManagement, validatorFactory,
        validatorFactoryMock, userTypeExtractor, userTypeExtractorMock,
        fakeCallback, fakeValidator, validatorMock;

	setup(function() {
        fakeCallback = function() {};
        fakeValidator = {
            validate: function() {

            }
        };
        paramsTypeUserPush = {
            username: '#usp_user',
            password: 'pass'
        };
        paramsTypeVM = {
            username: '#vmn_user',
            password: 'pass'
        };
        paramsTypeManagement= {
            username: '#mng_user',
            password: 'pass'
        };
        wrongParams = {
            kartoffeln: 'ja'
        };
        validatorFactory = {
            getValidator: function(type) {
                return fakeValidator;
            }
        };
        validatorMock = sinon.mock(fakeValidator);
        validatorFactoryMock = sinon.mock(validatorFactory);

        userTypeExtractor = new UserTypeExtractor();


        sut = new ValidatorRouter(validatorFactory, userTypeExtractor);
    });

	teardown(function() {
	});

	suite('#validate', function() {
        var exp;

        setup(function() {
            exp = validatorMock.expects('validate').once().withExactArgs(paramsTypeVM, sinon.match.func);
        });

        test('throws exception if no username as param', function() {
            var expected = 'No username defined';
            assert.throws(function() {
                sut.validateUserAuth(wrongParams);
            }, expected);
        });

        test('calls validator validate with right params', function() {
            userTypeExtractorMock = sinon.mock(userTypeExtractor);
            sut.validateUserAuth(paramsTypeVM, fakeCallback);
            exp.verify();
        });

        // see validator_router comment to see why this test is skipped!
        test.skip('throws exception if unknown user type', function() {
            var expected = 'Invalid user type for ' + paramsTypeVM.username;
            sinon.stub(userTypeExtractor, 'getUserType', function() {
                return null;
            });
            assert.throws(function() {
                sut.validateUserAuth(paramsTypeVM, fakeCallback);
            }, expected);
        });
	});
});



