
(function () {
    var errors = [],
        _fail = function (e) { errors.push(e); };
    if (typeof maltaV('NS') === 'undefined') {
        throw new Error("maltaV('NS') not found");
    }
    maltaV('NS').utils.test = {
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
