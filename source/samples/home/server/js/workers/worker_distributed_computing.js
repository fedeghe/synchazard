// eslint-disable-next-line no-unused-vars
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
                x = this.strategy();
                y = this.strategy();
                // res[Math.sqrt(x * x + y * y) < 1 ? 'inside' : 'outside']++;
                // why  loose time, around 1 sqrt is ininfluent
                res[(x * x + y * y) < 1 ? 'inside' : 'outside']++;
            }
            return res;
        },
        strategy: [
            Math.random
        ][strategy]
    };

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e) || e.data._TYPE !== 'action') return;

    switch (e.data._ACTION) {
        case 'startComputation':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'DistCompSendResult',
                _DATA: jobs[e.data._JOB]()
            });
            break;
        case 'requestRandomPairs':
        case 'updatedComputation':
        case 'thx':
        case 'noClients':
        case 'busy':
        case 'free': 
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'DistComp',
                _DATA: e.data
            });
            break;
        default: break;
    }
};