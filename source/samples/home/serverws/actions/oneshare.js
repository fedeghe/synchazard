

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
            shareFile: (userId, filePath, content) => {

                // if not there yet, create the user container
                if (!(userId in action.data.files)) {
                    action.data.files[userId] = []
                }

                // insert the file (collision who cares)
                action.data.files[userId].push({
                    filePath,
                    content,
                    subscribers: []
                });

                // return the ac
                return action.encode({
                    _ACTION: 'shareAdded',
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
        },
        set: {
            sharedFile: (userId, filePath, content) => {
                action.data.files[userId] = action.data.files[userId].map( o => {
                    if (o.filePath === filePath) {
                        o.content = content
                    }
                    return o;
                })
            },
        },
        get: {
            
            // returns the object containing all metadata file information
            // about the file shared by other users than userId
            //
            // toward: the user that connects,
            // for reusability  it is not excluding any user then 
            // could be necessary to filter out one user
            sharedFilesMeta: () => ({
                files: Object.keys(action.data.files)
                    .reduce((acc, uid) => {
                        acc[uid] = action.data.files[uid].map(f => ({
                            filePath: f.filePath,
                            subscribersCount: f.subscribers.length,
                        }))
                        return acc;
                    }, {})
                }
            ),
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
                ws.send(action.encode({
                    _ACTION: 'sharedFiles',
                    _PAYLOAD: action.data.get.sharedFilesMeta()
                }));
                break;

            /**
             * when a user shares a file just 
             * - if not existing, create the userId keyed array in action.data.files
             * - add {filePath, content} to action.data.files[userId]
             * - broadcast shared files (all clients will have to ignore their ones)
             */
            case 'addShare':
                synchazard.otherscast(action.data.actions.shareFile(data._ID, data._FILE.name, data._FILE.content))
                break;

            /**
             * when a user update a file the new content will be sent
             * (the file is already in the users list)
             * - update the entry in the userId keyed array
             * - broadcast to all subscribers
             */
            case 'updateShare':
                action.data.funcz.updateSharedFile(data._ID, data._FILE.name, data._FILE.content);
                // eslint-disable-next-line no-case-declarations
                synchazard.otherscast(action.data.actions.sendSharedFiles());
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
    }, (data) => {
        // on disconnection , update the list removing the user and all his files\
        // then broadcast the updated list
        // every client will have to remove those ones that he is looking at
        // and have been removed
        console.log('dis-connecting')
        console.log(data)
    });

};
