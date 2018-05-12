"use strict";

var worker = this,
    actors = null;

worker.onmessage = function (e) {
    /**  MANDATORY TO SET/CHECK collisions */
    if (e.data.___TYPE === '___INITACTORS') {
        actors = e.data.___ACTORS;
    }
    if (actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    /** */

    switch (e.data.___TYPE) {
        case 'action':
            worker.postMessage({
                ___HANDLER: 'Collab',
                ___DATA: e.data
            });
            break;
        default:
            worker.postMessage(e.data);
            break;
    }
};