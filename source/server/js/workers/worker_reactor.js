"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'reactor_disableAll':
        case 'reactor_enableAll':
        case 'reactor_updateInitStatus':
            self.postMessage({
                ___HANDLER: 'Reactor',
                ___DATA: e.data
            });
            break;
        case 'json':
            self.postMessage({
                ___HANDLER: 'render2',
                ___DATA: e.data.___PAYLOAD
            });
            break;
        default:
            self.postMessage(e.data);
            break;
    }
};