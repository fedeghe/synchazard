module.exports.launch = (action, synchazard, params) => {

    "use strict";
    const STATUSES = {
        PLAYING: 'PLAYING',
        WAITING: 'WAITING',
        IDLE: 'IDLE'
    }
    const updateState = () => {
        
    };

    let state = {
        status: STATUSES.IDLE, // 
        players: []
    };

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'beStatusAware',
                    _PAYLOAD: state
                }, { data: data }));
                break;
        }
    });
};
