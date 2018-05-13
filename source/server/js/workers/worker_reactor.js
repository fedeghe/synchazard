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
        case 'reactor':
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
        
    
};