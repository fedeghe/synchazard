// eslint-disable-next-line no-unused-vars
var actors = null;

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {

    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'initDone':
        case 'nextDone':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'hello',
                _DATA: {
                    _PAYLOAD: e.data._PAYLOAD,
                    _TIME: e.data._TIME
                }
            });
            break;
        case 'boldMe':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'hello',
                _DATA: e.data._ACTION
            });
            break;
        default:break;
    }
};