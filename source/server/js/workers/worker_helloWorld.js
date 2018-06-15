"use strict";

var actors = null;

self.onmessage = function (e) {
    
    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'initDone':
            case 'nextDone':
                self.postMessage({
                    ___HANDLER: 'hello',
                    ___DATA: {
                        ___PAYLOAD: e.data.___PAYLOAD,
                        ___TIME: e.data.___TIME
                    }
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