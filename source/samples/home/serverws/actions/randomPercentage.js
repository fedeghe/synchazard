module.exports.launch = (action, synchazard, params) => {

    "use strict";

    action.setup({ num: 0 });

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'graph',
                    _PAYLOAD: action.data
                }));
                break;
        }
    });

    // RUN
    setInterval(() => {
        action.data.num = ~~(Math.random() * 100);
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'graph',
            _PAYLOAD: action.data
        }));
    }, 50);
    
};