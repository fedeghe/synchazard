"use strict";

var worker = this,
    enforceActorsMatch = $SHARED.ENFORCEACTORS$,
    actors = null;

worker.onmessage = function (e) {
    
    /** 66.0
     * MANDATORY TO SET/CHECK collisions
     */
    //
    // this is for init settings of the actors,
    // from bro toward the worker
    if (e.data.___TYPE === '___INITACTORS') {
        actors = e.data.___ACTORS || '';
    }
    //
    // this is the check about actors when the
    // worker receives a message from the webcoket
    if (enforceActorsMatch){
        if (!actors || actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    } else {
        if (actors && actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    }
    /** end of mandatory stuff, unlukily for the moment
     * is not possible to write it in the worker when created
     */ 

    if (e.data.___TYPE === 'action'){
        switch (e.data.___ACTION) {
            case 'init':
                worker.postMessage({
                    ___TYPE: 'action',
                    ___ACTION: 'init',
                    ___HANDLER: 'chess',
                    ___DATA: e.data
                });
                break;
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};