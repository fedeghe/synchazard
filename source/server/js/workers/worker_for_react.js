"use strict";

var worker = this,
    actors = null;

worker.onmessage = function (e) {
    /**  MANDATORY TO SET/CHECK collisions */
    if (e.data.___TYPE === '___INITACTORS') {
        actors = e.data.___ACTORS || '';
    }
    if (actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    /** */

    switch (e.data.___TYPE) {
        case 'status': 
            worker.postMessage({
                ___HANDLER: 'react',
                ___DATA: e.data.___PAYLOAD
            });
            break;
    }
};