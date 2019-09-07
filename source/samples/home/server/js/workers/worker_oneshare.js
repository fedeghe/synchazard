// eslint-disable-next-line no-unused-vars
var actors = null;

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        default:
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'oneShare',
                _DATA: e.data
            });
            break;
    }
};
