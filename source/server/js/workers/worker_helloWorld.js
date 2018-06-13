"use strict";

var actors = null;

self.onmessage = function (e) {
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