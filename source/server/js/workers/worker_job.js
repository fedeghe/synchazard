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
    
    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'doComputation':
                worker.postMessage({
                    ___HANDLER: 'computer',
                    ___DATA: e.data.___JOB
                });
                break;
        }
    }
};