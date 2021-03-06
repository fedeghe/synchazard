// eslint-disable-next-line no-unused-vars
var actors = null;

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {

    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'reactor_disableAll':
        case 'reactor_enableAll':
        case 'reactor_updateInitStatus':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'Reactor',
                _DATA: e.data
            });
            break;
        case 'json':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'render2',
                _DATA: e.data._PAYLOAD
            });
            break;
        default:
            // eslint-disable-next-line no-restricted-globals
            self.postMessage(e.data);
            break;
    }
};