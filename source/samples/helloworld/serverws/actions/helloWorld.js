module.exports.launch = (action, synchazard, params) => {

    "use strict";
    const updateState = () => {
        const newTwo = state.one + state.two;
        state.one = state.two;
        state.two  = newTwo;
    };

    let state = {one: 0, two: 1};

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'initDone',
                    _PAYLOAD: state
                }, { data: data }));
                break;
            case 'next':
                updateState();
                synchazard.broadcast(action.encodeMessage({
                    _ACTION: 'nextDone',
                    _PAYLOAD: state
                }, { data: data }));
                ws.send(action.encodeMessage({
                    _ACTION: 'boldMe'
                }, { data: data }));
                break;
        }
    });
};
