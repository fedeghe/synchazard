"use strict";

var actors = null;

self.onmessage = function (e) {
    
    // self.importScripts('onMessageLock.js')

    if (e.data.___TYPE === 'action'){
        switch (e.data.___ACTION) {
            case 'init':
                self.postMessage({
                    ___TYPE: 'action',
                    ___ACTION: 'init',
                    ___HANDLER: 'chess',
                    ___DATA: e.data
                });
                break;
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};