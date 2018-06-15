"use strict";

var actors = null;

self.onmessage = function (e) {
    
    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'status': 
                self.postMessage({
                    ___HANDLER: 'react',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
        }
    }
};