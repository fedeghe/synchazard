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

    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
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
    }
};