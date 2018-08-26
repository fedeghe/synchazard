"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    
    switch (e.data._ACTION) {
        case 'init':
            self.postMessage({
                _TYPE: 'action',
                _ACTION: 'init',
                _HANDLER: 'chessManager',
                _DATA: e.data
            });
            break;
        case 'matchCreated':
            self.postMessage({
                _TYPE: 'action',
                _ACTION: 'matchCreated',
                _HANDLER: 'chessManager',
                _DATA: e.data
            });
            break;
        default:
            self.postMessage(e.data);
            break;
    }
};