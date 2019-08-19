

module.exports.launch = (action, synchazard /* , params */) => {
    
    action.setup({
        files: {/* {
            user: [file1, file2]
        } */},
        actions: {
            sendUserFiles: () => action.encode({
                _ACTION: 'userFiles',
                _PAYLOAD: {
                    files: action.data.files
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
                action.data.actions.sendUserFiles()
                ws.send(action.encode({
                    _ACTION: 'OSstatusFile',
                    _PAYLOAD: {
                        time: new Date()
                    }
                }));
                break;
            case 'addShare':
                
                break;
            case 'removeShare':

                break;
            case 'addShared':
                
                break;
            case 'removeShared':
                
                break;

            default: break;
        }
    });

};
