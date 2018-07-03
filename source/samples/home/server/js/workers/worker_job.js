"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'doComputation':
            self.postMessage({
                _HANDLER: 'computer',
                _DATA: e.data._JOB
            });
            break;
    }
};