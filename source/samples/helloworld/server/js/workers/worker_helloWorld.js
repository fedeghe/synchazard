"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'initDone':
        case 'nextDone':
            self.postMessage({
                _HANDLER: 'hello',
                _DATA: {
                    _PAYLOAD: e.data._PAYLOAD,
                    _TIME: e.data._TIME
                }
            });
            break;
        case 'boldMe':
            self.postMessage({
                _HANDLER: 'hello',
                _DATA: e.data._ACTION
            });
            break;
        default:break;
    }
};