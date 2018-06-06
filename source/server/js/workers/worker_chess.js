"use strict";

var worker = this;

worker.onmessage = function (e) {
    
    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action'){
        switch (e.data.___ACTION) {
            case 'init':
                worker.postMessage({
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