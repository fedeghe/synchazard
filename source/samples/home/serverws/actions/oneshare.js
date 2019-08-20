

module.exports.launch = (action, synchazard /* , params */) => {
    
    

    action.setup({
        files: {/* {
            userId: [{
                filePath: '',
                content: ''
                subscribers: [userId1, userId2]
            }]
        } */},
        actions: {
            sendSharedFiles: userId => action.encode({
                _ACTION: 'userFiles',
                _PAYLOAD: {
                    files: Object.keys(action.data.files)
                        .filter(uk => uk !== userId).map(uk => ({
                            [uk]: action.data.files[uk]
                        }))
                }
            }),
            shareFile: (userId, filePath, content) => {
                if (!(userId in action.data.files)) {
                    action.data.files[userId] = []
                }
                action.data.files[userId].push({filePath, content});
                return action.encode({
                    _ACTION: 'sharedAdded',
                    _PAYLOAD: {
                        userId,
                        filePath,
                        content
                    }
                });
            },
            updateSharedFile: (userId, filePath, content) => {
                action.data.files[userId].push({filePath, content});
                return action.encode({
                    _ACTION: 'sharedAdded',
                    _PAYLOAD: {
                        userId,
                        filePath,
                        content
                    }
                });
            },
            unshareFile: (userId, filePath) => action.encode({
                _ACTION: '',
                _PAYLOAD: {
                    
                }
            }),
            observeFile: (userId, owner_id, filePath) => action.encode({
                _ACTION: '',
                _PAYLOAD: {
                    
                }
            }),
            unobserveFile: (userId, owner_id, filePath) => action.encode({
                _ACTION: '',
                _PAYLOAD: {
                    
                }
            })

        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.data.actions.sendSharedFiles(data._ID));
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
