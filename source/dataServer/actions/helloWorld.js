module.exports.launch = (action, socketSrv, params) => {

    "use strict";
    const updateState = () => {
        const newTwo = action.data.one + action.data.two;
        action.data.one = action.data.two;
        action.data.two  = newTwo;
    };  
        
    action.setup({ one: 0, two: 1});

    action.onconnection((data, ws) => {
        
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'init':
                    ws.send(action.encodeMessage({
                        ___ACTION: 'initDone',
                        ___PAYLOAD: action.data
                    }));
                    break;
                case 'next':
                    updateState();
                    socketSrv.broadcast(action.encodeMessage({
                        ___ACTION: 'nextDone',
                        ___PAYLOAD: action.data
                    }));
                    ws.send(action.encodeMessage({
                        ___ACTION: 'boldMe'
                    }));
                    break;
            }
        }
    });
};