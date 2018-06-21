module.exports.launch = (action, socketSrv, params) => {

    "use strict";

    // SETUP
    //
    action.setup({ num: 0 });
    
    // INIT
    //
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    ___ACTION: 'json',
                    ___PAYLOAD: action.data
                }));
                break;
        }
    });

    // RUN
    //
    setInterval(() => {
        action.data.num++;
        var act = {
            ___ACTION: 'json',
            ___PAYLOAD: action.data
        };
        socketSrv.broadcast(action.encodeMessage(act));
    }, 1000);
};