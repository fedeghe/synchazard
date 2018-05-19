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
            case 'reactor_disableAll':
            case 'reactor_enableAll':
            case 'reactor_updateInitStatus':
                worker.postMessage({
                    ___HANDLER: 'Reactor',
                    ___DATA: e.data
                });
                break;
            case 'json':
                worker.postMessage({
                    ___HANDLER: 'render2',
                    ___DATA: e.data.___PAYLOAD
                });
                break;
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};