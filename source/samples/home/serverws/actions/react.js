const interval = require('@fedeghe/interval');

module.exports.launch = (action, synchazard /* , params */) => {
    
    // CONNECTION
    //
    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'status',
                    _PAYLOAD: {
                        time: new Date()
                    }
                }));
                break;
            default: break;
        }
    }).start();

    // RUN
    //
    interval(() => {
        var t = new Date();
        synchazard.broadcast(action.encode({
            _ACTION: 'status',
            _PAYLOAD: {
                time: t
            }
        }));
    }, 1000).run();
};
