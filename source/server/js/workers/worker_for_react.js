"use strict";

var worker = this,
    enforceActorsMatch = $SHARED.ENFORCEACTORS$,
    actors = null;

worker.onmessage = function (e) {
    /**  MANDATORY TO SET/CHECK collisions */
    if (e.data.___TYPE === '___INITACTORS') {
        actors = e.data.___ACTORS || '';
    }
    if (enforceActorsMatch && actors && actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    /** */

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'status': 
                worker.postMessage({
                    ___HANDLER: 'react',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
        }
    }
};