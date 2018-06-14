module.exports.launch = (action, socketSrv, params) => {

    "use strict";
    const updateState = () => {
        const newTwo = state.one + state.two;
        state.one = state.two;
        state.two  = newTwo;
    };

    let state = {one: 0, two: 1};

    action.onconnection((data, ws) => {
        
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'init':
                    ws.send(action.encodeMessage({
                        ___ACTION: 'initDone',
                        ___PAYLOAD: state,
                        ___TIME: data.___TIME
                    }));
                    break;
                case 'next':
                    updateState();
                    socketSrv.broadcast(action.encodeMessage({
                        ___ACTION: 'nextDone',
                        ___PAYLOAD: state,
                        ___TIME: data.___TIME
                    }));
                    ws.send(action.encodeMessage({
                        ___ACTION: 'boldMe'
                    }));
                    break;
            }
        }
    });
};