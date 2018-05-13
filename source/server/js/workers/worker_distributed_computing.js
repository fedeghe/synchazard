"use strict";

var worker = this,
    actors = null,
    jobs = {
        generate : function () {
            var res = {
                    inside: 0,
                    outside: 0
                },
                n = 1E7,
                x, y;
            while (n--) {
                x = Math.random(),
                y = Math.random();
                res[Math.sqrt((x * x + y * y)) < 1 ? 'inside' : 'outside']++;
            }
            return res;
        }
    };

worker.onmessage = function (e) {
    /**  MANDATORY TO SET/CHECK collisions */
    if (e.data.___TYPE === '___INITACTORS') {
        actors = e.data.___ACTORS || '';
    }
    if (actors.split(',').indexOf(e.data.___ACTORS) < 0) return;
    /** */

    switch (e.data.___TYPE) {
        case 'requestRandomPairs':
            worker.postMessage({
                ___HANDLER: 'DistComp',
                ___DATA: e.data
            });
            break;
        case 'startComputation':
            worker.postMessage({
                ___HANDLER: 'DistCompSendResult',
                ___DATA: jobs[e.data.___JOB]()
            });
            break;
        case 'endComputation':
            worker.postMessage({
                ___HANDLER: 'DistCompConsumeResult',
                ___DATA: e.data
            });
            break;
    }
};