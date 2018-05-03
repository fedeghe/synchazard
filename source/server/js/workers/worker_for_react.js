"use strict";

var worker = this;

worker.onmessage = function (e) {
    switch (e.data.___TYPE) {
        case 'status': 
            worker.postMessage({
                ___HANDLER: 'react',
                ___DATA: e.data.___PAYLOAD
            });
            break;
    }
};