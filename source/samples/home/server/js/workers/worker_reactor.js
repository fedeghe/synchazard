"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'reactor_disableAll':
        case 'reactor_enableAll':
        case 'reactor_updateInitStatus':
            self.postMessage({
                _HANDLER: 'Reactor',
                _DATA: e.data
            });
            break;
        case 'json':
            self.postMessage({
                _HANDLER: 'render2',
                _DATA: e.data._PAYLOAD
            });
            break;
        default:
            self.postMessage(e.data);
            break;
    }
};