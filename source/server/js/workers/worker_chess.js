"use strict";

var worker = this;

worker.onmessage = function (e) {
    console.log('worker')
    console.log(e)
    if (e.data.___TYPE === 'action'){
        switch (e.data.___ACTION) {
            case 'init':
                worker.postMessage({
                    ___HANDLER: 'chess',
                    ___TYPE: 'action',
                    ___ACTION: 'init',
                    ___DATA: e.data
                });
                break;
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};