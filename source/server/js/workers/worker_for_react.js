"use strict";

var worker = this;

worker.onmessage = function (e) {
    
    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'status': 
                worker.postMessage({
                    ___HANDLER: 'react',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
        }
    }
};