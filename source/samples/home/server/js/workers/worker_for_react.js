"use strict";

var actors = null;

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'status': 
            self.postMessage({
                ___HANDLER: 'react',
                ___DATA: e.data.___PAYLOAD
            });
            break;
    }

};