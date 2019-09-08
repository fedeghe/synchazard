module.exports.launch = (action, synchazard/* , params */) => {
    const state = {one: 0, two: 1},
        updateState = () => {
            const newTwo = state.one + state.two;
            state.one = state.two;
            state.two  = newTwo;
        };


    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'initDone',
                    _PAYLOAD: state
                }, { data: data }));
                break;
            case 'next':
                updateState();
                synchazard.broadcast(action.encode({
                    _ACTION: 'nextDone',
                    _PAYLOAD: state
                }, { data: data }));
                ws.send(action.encode({
                    _ACTION: 'boldMe'
                }, { data: data }));
                break;
            default: break;
        }
    }).start();
};
