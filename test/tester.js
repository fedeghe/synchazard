var assert = require('assert'),
    path = require('path'),
    fs = require('fs');

SH = { utils: {} };

/*
[Malta] ../dataServer/js/lib/testnject.js
*/

(function () {
    if (typeof SH === 'undefined') throw 'SH not found';
    var errors = [],

        _fail = function (e) { errors.push(e);};

        SH.utils.test = {
            assert: function (tFunc, errMsg) {
                tFunc() || _fail(errMsg);
                return this;
            },
            report: function (success, fail) {
                errors.length ? fail(errors) : success();
                errors = [];
            }
        };
})();



describe('test tester', function () {

    it('should pass', function (done) {
        SH.utils.test.assert(function() {
            return true;
        }).report(function () {
            done();
        })
    });

    it('should fail', function (done) {
        SH.utils.test.assert(function () {
            return false;
        }).report(
            function () {},
            function (errors) {
                errors.length && done();
            }
        )
    });

    it('should fail three times', function (done) {
        SH.utils.test.assert(function () {
            return false;
        }, 'error1').assert(function () {
            return false;
        }, 'error2').assert(function () {
            return false;
        }, 'error3').report(
            function () { },
            function (errors) {
                errors[0] == 'error1' &&
                errors[1] == 'error2' &&
                errors[2] == 'error3' &&
                errors.length === 3 &&done();
            }
        )
    });
});