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
    UserTypeExtractor = require('../lib/validator/validator-type-extractor.js');

suite.skip('UserTypeExtractor', function(){
	var sut, exp, vmTag, pushTag, managementTag;

	setup(function() {
        sut = new UserTypeExtractor();
        vmTag = '#vmn_';
        pushTag = '#usp_';
        managementTag = '#srv_';
    });

	teardown(function() {
	});

	suite('#getUserType', function() {
        setup(function() {
        });

		test('should return userpush for usp tag', function () {
            var actual = sut.getUserType(pushTag);
            assert.equal(actual, 'userpush');
        });

        test('should return vm for vm tag', function () {
            assertResult(vmTag, 'vm');
        });

        test('should return management for mng tag', function () {
            assertResult(managementTag, 'service');
        });
	});

    function assertResult(tag, expected) {
        var actual = sut.getUserType(tag);
        assert.equal(actual, expected);
    }
});
