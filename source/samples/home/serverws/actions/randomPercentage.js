const interval = require('@fedeghe/interval');

module.exports.launch = (action, synchazard /* , params */) => {
    
    // SETUP
    //
    action.setup({ num: 0 });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'graph',
                    _PAYLOAD: action.data
                }));
                break;
            default: break
        }
    });

    // RUN
    //
    interval(() => {
        action.data.num = ~~(Math.random() * 100);
        synchazard.broadcast(action.encode({
            _ACTION: 'graph',
            _PAYLOAD: action.data
        }));
    }, 50).run();
};
