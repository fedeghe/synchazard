module.exports.launch = (action, synchazard /* , params */) => {
    // SETUP
    // messages storage
    //
    action.setup({ messages: [] });

    // CONNECTION
    //
    action.onConnect((data, ws) => {
        let newMessage;
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'messages',
                    _PAYLOAD: {
                        all: action.data.messages
                    }
                }));
                break;
            case 'new_message':
                newMessage = {
                    id: data._ID,
                    message: data._MESSAGE || 'no message',
                    timestamp: data._TIMESTAMP
                };

                '_MESSAGE' in data &&
                    action.data.messages.push(newMessage);

                // send back a unicast message to the source
                //
                ws.send(action.encode({
                    _ACTION: 'self',
                    _PAYLOAD: data._MESSAGE
                }));

                // and broadcast
                //
                synchazard.broadcast(action.encode({
                    _ACTION: 'message',
                    _PAYLOAD: {
                        one: newMessage
                    }
                }));
                break;
            default: break;
        }
    }).start();
};
