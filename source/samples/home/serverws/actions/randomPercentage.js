module.exports.launch = (action, synchazard, params) => {

    "use strict";

    action.setup({ num: 0 });

    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    ___ACTION: 'graph',
                    ___PAYLOAD: action.data
                }));
                break;
        }
    });

    // RUN
    setInterval(() => {
        action.data.num = ~~(Math.random() * 100);
        synchazard.broadcast(action.encodeMessage({
            ___ACTION: 'graph',
            ___PAYLOAD: action.data
        }));
    }, 50);
    
};