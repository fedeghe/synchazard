"use strict";

var worker = this;

worker.onmessage = function (e) {
    switch (e.data.___TYPE) {
        case 'action':
            worker.postMessage({
                ___HANDLER: 'Collab',
                ___DATA: e.data
            });
            break;
        default:
            worker.postMessage(e.data);
            break;
    }
};