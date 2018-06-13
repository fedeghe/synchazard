"use strict";

var actors = null;

self.onmessage = function (e) {

    self.importScripts('onMessageLock.js');
    if (filter(e)) return;

    if (e.data.___TYPE ===  'action') {
        self.postMessage({
            ___HANDLER: 'Collab',
            ___DATA: e.data
        });
    }
};