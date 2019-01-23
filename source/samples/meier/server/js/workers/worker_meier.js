"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {
    if (actorsDontMatch(e)) {
        return;
    }

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'beStatusAware':
            self.postMessage({
                _HANDLER: 'init',
                _DATA: e.data
            });
        default:break;
    }
};