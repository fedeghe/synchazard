"use strict";

var actors = null,
    strategy = 0,
    jobs = {
        generate: function () {
            var res = {
                inside: 0,
                outside: 0
            },
                n = 1E7,
                x, y;
            while (n--) {
                x = this.strategy(),
                y = this.strategy();
                // why  loose time, around 1 sqrt is ininfluent
                // res[Math.sqrt(x * x + y * y) < 1 ? 'inside' : 'outside']++;
                res[(x * x + y * y) < 1 ? 'inside' : 'outside']++;
            }
            return res;
        },
        strategy: [
            Math.random
        ][strategy]
    };

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'requestRandomPairs':
            self.postMessage({
                _HANDLER: 'DistComp',
                _DATA: e.data
            });
            break;
        case 'startComputation':
            self.postMessage({
                _HANDLER: 'DistCompSendResult',
                _DATA: jobs[e.data._JOB]()
            });
            break;
        case 'endComputation':
            self.postMessage({
                _HANDLER: 'DistCompConsumeResult',
                _DATA: e.data
            });
            break;
        case 'thx':
            self.postMessage({
                _HANDLER: 'DistCompSayThx',
                _DATA: e.data
            });
            break;
        case 'noClients': 
            self.postMessage({
                _HANDLER: 'DistCompNoClients',
                _DATA: e.data
            });
            break;
    }
};