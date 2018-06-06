"use strict";

var worker = this;

worker.onmessage = function (e) {

    $$onMessageLock.js$$

    if (e.data.___TYPE ===  'action') {
        worker.postMessage({
            ___HANDLER: 'Collab',
            ___DATA: e.data
        });
    }
};