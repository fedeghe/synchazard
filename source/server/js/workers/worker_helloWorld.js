"use strict";

var worker = this,
    actors = null;

worker.onmessage = function (e) {
    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'initDone':
            case 'nextDone':
                worker.postMessage({
                    ___HANDLER: 'hello',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
            case 'boldMe':
                worker.postMessage({
                    ___HANDLER: 'hello',
                    ___DATA: e.data.___ACTION
                });
                break;
            default:break;
        }
    }
};