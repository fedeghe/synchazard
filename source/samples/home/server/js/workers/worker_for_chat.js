"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch(e.data.___ACTION) {
        case 'messages':
            self.postMessage({
                ___HANDLER: 'Chat',
                ___DATA: e.data.___PAYLOAD
            });
            break;
        case 'message':
            self.postMessage({
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
            self.postMessage({
                ___HANDLER: 'ChatSelfHandler',
                ___DATA: e.data.___PAYLOAD
            });
            break;
    }
};