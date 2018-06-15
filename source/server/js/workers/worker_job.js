"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'doComputation':
            self.postMessage({
                ___HANDLER: 'computer',
                ___DATA: e.data.___JOB
            });
            break;
    }
};