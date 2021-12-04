

// eslint-disable-next-line no-unused-vars
var actors = null;

importScripts('actorsDontMatch.js');
// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {

    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch(e.data._ACTION) {
        case 'messages':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'Chat',
                _DATA: e.data
            });
            break;
        case 'message':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'Chat',
                _DATA: e.data
            });
            break;
        /**
         * handle what the server will just reply to the client itself
         * not broadcasted, what if the client does something bad and the client
         * want to run something just for him, just write a handler that execute a script
         * and decide how to punish him
         */
        case 'self':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'ChatSelfHandler',
                _DATA: e.data
            });
            break;
        default: break;
    }
};