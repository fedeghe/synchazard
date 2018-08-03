module.exports.launch = (action, synchazard, params) => {
    
    "use strict";

    // setup messages storage
    //
    action.setup({messages: []});

    // just listen
    //
    action.onconnection((data, ws) => {

        let newMessage;

        if (data._TYPE !== 'action') return;

        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'messages',
                    _PAYLOAD: {
                        all : action.data.messages
                    }
                }));
                break;
            case 'new_message':
                newMessage = {
                    id: data._ID,
                    message: data._MESSAGE || 'no message',
                    timestamp: data._TIMESTAMP
                };
                
                '_MESSAGE' in data
                && action.data.messages.push(newMessage);

                // self message
                //
                ws.send(action.encodeMessage({
                    _ACTION: 'self',
                    _PAYLOAD: data._MESSAGE
                }));

                // and broadcast
                //
                synchazard.broadcast(action.encodeMessage({
                    _ACTION: 'message',
                    _PAYLOAD: {
                        one: newMessage
                    }
                }));
                break;
        }
    });
};