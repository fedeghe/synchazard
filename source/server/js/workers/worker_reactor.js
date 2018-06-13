"use strict";

var actors = null;

self.onmessage = function (e) {

    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'reactor_disableAll':
            case 'reactor_enableAll':
            case 'reactor_updateInitStatus':
                self.postMessage({
                    ___HANDLER: 'Reactor',
                    ___DATA: e.data
                });
                break;
            case 'json':
                self.postMessage({
                    ___HANDLER: 'render2',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
            default:
                self.postMessage(e.data);
                break;
        }
    }
};