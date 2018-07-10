module.exports.launch = (action, synchazard, params) => {
    
    "use strict";

    // setup messages storage
    //
    action.setup({matches: []});

    const matches = [];

    // just listen
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;

        console.log(data);
        
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'init',
                    _PAYLOAD: action.data.matches
                }));
                break;
            case 'createMatch':
                ws.send(action.encodeMessage({
                    _ACTION: 'matchCreated',
                    _PAYLOAD: action.data.matches
                }));
                break;

            case 'joinMatch':
                ws.send(action.encodeMessage({
                    _ACTION: 'matchJoined',
                    _PAYLOAD: action.data.matches
                }));
                break;
            default: 
                console.log(data);
                break
        }
        
    });
};