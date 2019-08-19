

module.exports.launch = (action, synchazard /* , params */) => {
    
    action.setup({
        files: {/* {
            user: [file1, file2]
        } */},
        actions: {
            sendUserFiles: id => action.encode({
                _ACTION: 'userFiles',
                _PAYLOAD: {
                    files: action.data.files[id]
                }
            }),
            sendSharedFiles: () => {

            },
        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                action.data.actions.sendUserFiles(2)
                ws.send(action.encode({
                    _ACTION: 'OSstatusFile',
                    _PAYLOAD: {
                        time: new Date()
                    }
                }));
                break;
            default: break;
        }
    });

};
