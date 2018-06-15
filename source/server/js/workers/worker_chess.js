"use strict";

var actors = null;

self.onmessage = function (e) {
    
    $$onMessageLock.js$$

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
                self.postMessage(e.data);
                break;
        }
    }
};