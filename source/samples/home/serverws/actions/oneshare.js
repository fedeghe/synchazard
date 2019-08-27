

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
            sendSharedFiles: () => action.encode({
                _ACTION: 'userFiles',
                _PAYLOAD: {
                    files: action.data.files
                    // files: Object.keys(action.data.files)
                    //     .map(uk => ({
                    //         [uk]: action.data.files[uk].map(f => ({
                    //             filePath: f.filePath,
                    //             subscribersCount: f.subscribers.length,
                    //         }))
                    //     }))
                }
            }),
            shareFile: (userId, filePath, content) => {
                if (!(userId in action.data.files)) {
                    action.data.files[userId] = []
                }
                action.data.files[userId].push({
                    filePath,
                    content,
                    subscribers: []
                });

                console.log('Shared file added:')
                console.log(action.data.files)

                const ret = action.encode({
                    _ACTION: 'shareAdded',
                    _PAYLOAD: {
                        userId,
                        filePath,
                        content
                    }
                });
                console.log(ret)
                return ret
            },
            updateSharedFile: (userId, filePath, content) => {
                
                action.data.files[userId] = action.data.files[userId].map( o => {
                    if (o.filePath === filePath) {
                        o.content = content
                    }
                    return o;
                })


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

            /**
             * when a client connects just
             * - send the list of all shared files (the client will have to ignore his ones)
             *  | but only {filePath, subscribersCount}
             */
            case 'init':
                ws.send(action.data.actions.sendSharedFiles());
                break;

            /**
             * when a user shares a file just 
             * - if not existing, create the userId keyed array in action.data.files
             * - add {filePath, content} to action.data.files[userId]
             * - broadcast shared files (all clients will have to ignore their ones)
             */
            case 'addShare':
                console.log('added Share')
                synchazard.otherscast(action.data.actions.shareFile(data._ID, data._FILE.name, data._FILE.content))
                console.log(data)  
                break;

            /**
             * when a user update a file the new content will be sent
             * (the file is already in the users list)
             * - update the entry in the userId keyed array
             * - broadcast to all subscribers
             */
            case 'updateShare':
                console.log(data)
                console.log('before')
                console.log(action.data.files[data._ID])
                action.data.actions.updateSharedFile(data._ID, data._FILE.name, data._FILE.content);
                console.log('after')
                console.log(action.data.files[data._ID])
                // eslint-disable-next-line no-case-declarations
                const up = action.data.actions.sendSharedFiles()
                console.log('action: ', up)
                synchazard.otherscast(up);
                break;

            /**
             * when the user unshare a file just
             * - remove it from the userId list
             * - broadcast shared files (all clients will have to ignore their ones)
             */
            case 'removeShare':
                break;

            /**
             * when a client subscribe to a file just
             * - add his userId into the file's subscribers list
             */
            case 'addShared':
                break;

            /**
             * when a client unsubscribe to a file just
             * - remove his userId into the file's subscribers list
             */
            case 'removeShared':
                break;

            default: break;
        }
    });

};
