"use strict";

var worker = this;

worker.onmessage = function (e) {
    switch (e.data.___TYPE) {
        case 'reactor':
            worker.postMessage({
                ___HANDLER: 'Reactor',
                ___DATA: e.data
            });
            break;
        case 'json':
            worker.postMessage({
                ___HANDLER: 'render2',
                ___DATA: e.data.___PAYLOAD
            });
            break;
        default:
            worker.postMessage(e.data);
            break;
    }
};