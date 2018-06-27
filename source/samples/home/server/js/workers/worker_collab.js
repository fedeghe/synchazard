"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    self.postMessage({
        ___HANDLER: 'Collab',
        ___DATA: e.data
    });    
};