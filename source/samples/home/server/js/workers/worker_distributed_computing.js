"use strict";

var actors = null,
    jobs = {
        generate: function () {
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

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'requestRandomPairs':
            self.postMessage({
                ___HANDLER: 'DistComp',
                ___DATA: e.data
            });
            break;
        case 'startComputation':
            self.postMessage({
                ___HANDLER: 'DistCompSendResult',
                ___DATA: jobs[e.data.___JOB]()
            });
            break;
        case 'endComputation':
            self.postMessage({
                ___HANDLER: 'DistCompConsumeResult',
                ___DATA: e.data
            });
            break;
        case 'thx':
            self.postMessage({
                ___HANDLER: 'DistCompSayThx',
                ___DATA: e.data
            });
            break;
    }
};