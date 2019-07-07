
(function () {
    if (typeof $NS$ === 'undefined') {
        throw new Error('$NS$ not found');
    }
    var errors = [],

        _fail = function (e) { errors.push(e); };

    $NS$.utils.test = {
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
