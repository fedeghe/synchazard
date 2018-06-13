"use strict";

var actors = null;

self.onmessage = function (e) {

    $$onMessageLock.js$$

    if (e.data.___TYPE ===  'action') {
        self.postMessage({
            ___HANDLER: 'Collab',
            ___DATA: e.data
        });
    }
};