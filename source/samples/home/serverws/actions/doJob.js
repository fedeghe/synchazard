module.exports.launch = (action, synchazard, params) => {

    "use strict";
    const jobs = {
        getFunc1: {
            func : function (r) {
                return Math.pow(3, r);
            },
            description: '3 ^ $p'
        }
    };

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'doComputation',
                    _JOB: {
                        func: jobs.getFunc1.func.toString(),
                        desc: jobs.getFunc1.description
                    }
                }))
                break;
        }
    });
};