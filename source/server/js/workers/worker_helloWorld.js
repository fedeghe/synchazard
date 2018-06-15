"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
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
};