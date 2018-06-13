"use strict";

var actors = null;

self.onmessage = function (e) {
    
    self.importScripts('onMessageLock.js');
    if (filter(e)) return;
    
    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'doComputation':
                self.postMessage({
                    ___HANDLER: 'computer',
                    ___DATA: e.data.___JOB
                });
                break;
        }
    }
};