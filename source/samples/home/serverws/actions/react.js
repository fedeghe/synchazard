const interval = require('@fedeghe/interval');

module.exports.launch = (action, synchazard /* , params */) => {
    
    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'status',
                    _PAYLOAD: {
                        time: new Date()
                    }
                }));
                break;
            default: break;
        }
    });

    // RUN
    //
    interval(() => {
        var t = new Date();
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'status',
            _PAYLOAD: {
                time: t
            }
        }));
    }, 1000).run();
};
