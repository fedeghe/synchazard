"use strict";

var worker = this,
    actors = null;

worker.onmessage = function (e) {
    
    $$onMessageLock.js$$
    
    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'doComputation':
                worker.postMessage({
                    ___HANDLER: 'computer',
                    ___DATA: e.data.___JOB
                });
                break;
        }
    }
};