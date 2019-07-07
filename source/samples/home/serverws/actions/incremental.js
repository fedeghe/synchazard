module.exports.launch = (action, synchazard, params) => {
    'use strict';
    // SETUP
    //
    action.setup({ num: 0 });
    // INIT
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
        case 'init':
            ws.send(action.encodeMessage({
                _ACTION: 'json',
                _PAYLOAD: action.data
            }));
            break;
        }
    });

    // RUN
    //
    setInterval(() => {
        action.data.num++;
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'json',
            _PAYLOAD: action.data
        }));
    }, 1000);
};
