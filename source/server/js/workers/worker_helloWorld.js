"use strict";

var actors = null;

self.onmessage = function (e) {
    
    self.importScripts('onMessageLock.js');
    if (filter(e)) return;

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'initDone':
            case 'nextDone':
                self.postMessage({
                    ___HANDLER: 'hello',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
            case 'boldMe':
                self.postMessage({
                    ___HANDLER: 'hello',
                    ___DATA: e.data.___ACTION
                });
                break;
            default:break;
        }
    }
};