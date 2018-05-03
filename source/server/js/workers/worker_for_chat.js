"use strict";

var worker = this;

worker.onmessage = function (e) {
    switch(e.data.___TYPE) {
        case 'messages':
            worker.postMessage({
                ___HANDLER: 'Chat',
                ___DATA: e.data.___PAYLOAD
            });
            break;
        case 'message':
            worker.postMessage({
                ___HANDLER: 'Chat',
                ___DATA: e.data.___PAYLOAD
            });
            break;
        /**
         * handle what the server will just reply to the client itself
         * not broadcasted, what if the client does something bad and the client
         * want to run something just for him, just write a handler that execute a script
         * and decide how to punish him
         */
        case 'self':
            worker.postMessage({
                ___HANDLER: 'ChatSelfHandler',
                ___DATA: e.data.___PAYLOAD
            });
            break;
    }
};