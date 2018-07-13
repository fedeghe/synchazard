const Interval = require('./tools/Interval');

module.exports.launch = (action, synchazard, params) => {

    "use strict";
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'status',
                    _PAYLOAD: {
                        time : new Date
                    }
                }));
                break;
        }
    });


 

    // RUN
    new Interval(() => {
        var t = new Date;
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'status',
            _PAYLOAD: {
                time: t
            }
        }));
    }, 1000).run();
};