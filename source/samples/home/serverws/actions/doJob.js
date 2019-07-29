module.exports.launch = (action /* , synchazard, params */) => {

    // SETUP
    //
    action.setup({
        jobs: {
            getFunc1: {
                func: function (r) {
                    return 3 ** r;
                },
                description: '3 ^ $p'
            }
        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'doComputation',
                    _JOB: {
                        func: action.data.jobs.getFunc1.func.toString(),
                        desc: action.data.jobs.getFunc1.description
                    }
                }));
                break;
            default: break;
        }
    });
};
