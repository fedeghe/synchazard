// eslint-disable-next-line no-unused-vars
var actors = null;

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {

    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'doComputation':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'computer',
                _DATA: e.data._JOB
            });
            break;
        default: break;
    }
};