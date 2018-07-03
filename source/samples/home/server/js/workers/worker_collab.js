"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    self.postMessage({
        _HANDLER: 'Collab',
        _DATA: e.data
    });    
};