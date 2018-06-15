"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'init':
            self.postMessage({
                ___TYPE: 'action',
                ___ACTION: 'init',
                ___HANDLER: 'chess',
                ___DATA: e.data
            });
            break;
        default:
            self.postMessage(e.data);
            break;
    }
};