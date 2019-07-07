/* eslint-disable no-unused-vars */
var Utilities = {
    storage: (function(W) {
        var storage = 'localStorage',
            avail = {
                localStorage: 1,
                sessionStorage: 1,
            };
        return {
            set: function(k, v, w) {
                W[w || storage].setItem(k, v);
            },
            get: function(k, w) {
                return W[w || storage].getItem(k);
            },
            remove: function(k, w) {
                W[w || storage].removeItem(k);
            },
            clear: function(w) {
                W[w || storage].clear();
            },
            use: function(l) {
                l in avail && (storage = l);
            },
        };
    })(window),
};
