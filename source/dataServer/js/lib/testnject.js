(function () {
    if (typeof $NS$ === 'undefined') throw '$NS$ not found';
    var errors = [],
        _fail = function (e) { errors.push(e);};

    $NS$.utils.test = (function () {
        return {
            assert: function (tFunc, errMsg) {
                tFunc() || _fail(errMsg);
                return this;
            },
            report: function (success, fail) {
                errors.length ? fail(errors) : success();
            }
        }
    })();
})();