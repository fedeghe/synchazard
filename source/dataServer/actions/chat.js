module.exports.launch = (action, socketSrv, params) => {
    
    "use strict";

    // setup messages storage
    //
    action.setup({messages: []});

    // just listen
    //
    action.onconnection((data, ws) => {

        let newMessage;

        if (data.___TYPE === 'action') {
            action.notify(__filename, data);
            switch (data.___ACTION) {
                case 'init':
                    socketSrv.broadcast(action.encodeMessage({
                        ___ACTION: 'messages',
                        ___PAYLOAD: {
                            all : action.data.messages
                        }
                    }));
                    break;

                case 'new_message':
                    newMessage = {
                        id: data.___CLIENT,
                        message: data.___MESSAGE,
                        timestamp: data.___TIMESTAMP
                    };
                    
                    '___MESSAGE' in data
                    && action.data.messages.push(newMessage);

                    // self message
                    //
                    ws.send(action.encodeMessage({
                        ___ACTION: 'self',
                        ___PAYLOAD: data.___MESSAGE
                    }));

                    // and broadcast
                    //
                    socketSrv.broadcast(action.encodeMessage({
                        ___ACTION: 'message',
                        ___PAYLOAD: {
                            one: newMessage
                        }
                    }));
                    break;
            }
        }
    });
};