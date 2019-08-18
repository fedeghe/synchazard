

module.exports.launch = (action, synchazard /* , params */) => {
    
    action.setup({
        files: [/*{
            user: [file1, file2]
        } */],
        actions: {

        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'statusFile',
                    _PAYLOAD: {
                        time: new Date()
                    }
                }));
                break;
            default: break;
        }
    });

};
