module.exports.launch = (action, socketSrv, params) => {

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
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'init':
                    console.log(`init ${__filename}`)
                    ws.send(action.encodeMessage({
                        ___TYPE: 'action',
                        ___ACTION: 'doComputation',
                        ___JOB: {
                            func: jobs.getFunc1.func.toString(),
                            desc: jobs.getFunc1.description
                        }
                    }))
                    break;
            }
        }
    });
};