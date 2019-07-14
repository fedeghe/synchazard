module.exports.launch = (action /* , synchazard, params */) => {

    const STATUSES = {
            PLAYING: 'PLAYING',
            WAITING: 'WAITING',
            IDLE: 'IDLE'
        },
        // eslint-disable-next-line no-unused-vars
        updateState = () => {
            
        },

        state = {
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
            default: break;
        }
    });
};
