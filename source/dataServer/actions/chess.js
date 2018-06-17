module.exports.launch = (action, socketSrv, params) => {
    
    "use strict";

    // setup messages storage
    //
    action.setup({matches: []});

    const matches = [];

    // just listen
    //
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    ___ACTION: 'init',
                    ___PAYLOAD: action.data.matches
                }));
                break;
            case 'createMatch':
                ws.send(action.encodeMessage({
                    ___ACTION: 'matchCreated',
                    ___PAYLOAD: action.data.matches
                }));
                break;

            case 'joinMatch':
                ws.send(action.encodeMessage({
                    ___ACTION: 'matchJoined',
                    ___PAYLOAD: action.data.matches
                }));
                break;
        }
        
    });
};