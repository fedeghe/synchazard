(function() {
    if (typeof maltaV('NS') === 'undefined') {
        throw new Error(`maltaV('NS') not found`);
    }
    let errors = [];
    const _fail = function(e) {
        errors.push(e);
    };
    // eslint-disable-next-line no-undef
    maltaV('NS').utils.test = {
        assert(tFunc, errMsg) {
            tFunc() || _fail(errMsg);
            return this;
        },
        report(success, fail) {
            errors.length ? fail(errors) : success();
            errors = [];
        },
    };
})();
