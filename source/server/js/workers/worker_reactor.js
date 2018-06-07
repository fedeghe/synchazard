"use strict";

var worker = this,
    actors = null;

worker.onmessage = function (e) {

    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'reactor_disableAll':
            case 'reactor_enableAll':
            case 'reactor_updateInitStatus':
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
    }
};