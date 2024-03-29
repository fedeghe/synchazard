/* eslint-disable complexity */


module.exports.launch = (action, synchazard /* , params */) => {
    
    

    action.setup({
        files: {/* {
            userId: [{
                filePath: '',
                content: '',
                subscribers: [userId1, userId2],
                pwd
            }]
        } */},
        actions: {

            sharedFiles: () => action.encode({
                _ACTION: 'sharedFiles',
                _PAYLOAD: action.data.get.sharedFilesMeta()
            }),
            shareAdded: (uid, name, content, pwd) => action.encode({
                _ACTION: 'shareAdded',
                _PAYLOAD: {
                    uid,
                    name,
                    pwd
                }
            }),
            shareRemoved: (uid, name) => action.encode({
                _ACTION: 'shareRemoved',
                _PAYLOAD: {
                    uid,
                    name
                }
            }),
            fileContent: (uid, name) => action.encode({
                _ACTION:'filecontent',
                _PAYLOAD: {
                    file: action.data.files[uid].find(e => e.filePath === name),
                }
            }),
            newContent: (uid, name) => action.encode({
                _ACTION: 'updatedContent',
                _PAYLOAD: {
                    file: action.data.files[uid].find(e => e.filePath === name)
                }
            }),
            requestPwdFor: (uid, name) => action.encode({
                _ACTION: 'requestPwd',
                _PAYLOAD: {
                    uid, file: name
                }
            }),
            wrongPwd: () => action.encode({
                _ACTION: 'wrongPwd'
            }),
            myFileContent: (uid, name) => action.encode({
                _ACTION:'myfilecontent',
                _PAYLOAD: {
                    file: action.data.files[uid].find(e => e.filePath === name),
                }
            })
        },
        set: {
            updateSharedFile: (userId, filePath, content) => {
                let subscribers = [];
                if (action.data.files[userId]) {
                    action.data.files[userId] = action.data.files[userId].map( o => {
                        if (o.filePath === filePath) {
                            o.content = content
                            subscribers = [...subscribers, ...o.subscribers]
                        }
                        return o;
                    })
                }
                return subscribers;
            },

            shareFile: (userId, filePath, content, pwd) => {
                // if not there yet, create the user container
                if (!(userId in action.data.files)) {
                    action.data.files[userId] = []
                }

                // insert the file (collision who cares)
                action.data.files[userId].push({
                    filePath,
                    content,
                    subscribers: [],
                    pwd
                });
            },
            observe: (idUserReq, trgFile, trgUser) => {
                if (action.data.files[trgUser]) {
                    action.data.files[trgUser] = action.data.files[trgUser].map(f => {
                        if (f.filePath === trgFile) {
                            f.subscribers.push(idUserReq)
                        }
                        return f;
                    })
                }
            }
        },
        unset: {
            userFiles: userId => {
                delete action.data.files[userId]
            },
            shareFile: (userId, filePath) => {
                // if not there yet, create the user container
                if (userId in action.data.files) {
                    action.data.files[userId] = action.data.files[userId].filter(o => o.filePath !== filePath)
                }
            },
            observe: (idUserReq, trgFile, trgUser) => {
                if (action.data.files[trgUser]) {
                    action.data.files[trgUser] = action.data.files[trgUser].map(f => {
                        if (f.filePath === trgFile) {
                            f.subscribers = f.subscribers.filter(s => s !== idUserReq)
                        }
                        return f;
                    })
                }
            }
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
                            pwd: f.pwd,
                        }))
                        return acc;
                    }, {})
                }
            ),
        }
    });

    // CONNECTION
    //
    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {

            /**
             * when a client connects just
             * - send the list of all shared files (the client will have to ignore his ones)
             *  | but only {filePath, subscribersCount}
             */
            case 'init':
                ws.send(action.data.actions.sharedFiles());
                break;

            /**
             * when a user shares a file just 
             * - if not existing, create the userId keyed array in action.data.files
             * - add {filePath, content} to action.data.files[userId]
             * - broadcast shared files (all clients will have to ignore their ones)
             */
            case 'addShare':
                action.data.set.shareFile(data._ID, data._FILE.name, data._FILE.content, data._PWD)
                synchazard.otherscast(data._ID, action.data.actions.shareAdded(data._ID, data._FILE.name, data._FILE.content, data._PWD))
                break;

            /**
             * when a user update a file the new content will be sent
             * (the file is already in the users list)
             * - update the entry in the userId keyed array
             * - broadcast to all subscribers
             */
            case 'updateShare':
                synchazard.subcast(
                    // subscribers
                    action.data.set.updateSharedFile(data._ID, data._FILE.name, data._FILE.content),
                    action.data.actions.newContent(data._ID, data._FILE.name)
                );
                break;

            /**
             * when the user unshare a file just
             * - remove it from the userId list
             * - broadcast shared files (all clients will have to ignore their ones)
             */
            case 'removeShare':
                action.data.unset.shareFile(data._ID, data._FILE);
                synchazard.otherscast(data._ID, action.data.actions.shareRemoved(data._ID, data._FILE));
                break;
            
            case 'addObserver':
                action.data.set.observe(data._ID, data._FILE, data._USER);
                if (action.data.files[data._USER]
                    && action.data.files[data._USER].find(share => share.filePath ===data._FILE).pwd
                ) {
                    ws.send(action.data.actions.requestPwdFor(data._USER, data._FILE))
                } else {
                    ws.send(action.data.actions.fileContent(data._USER, data._FILE))
                }
                break;

            case 'removeObserver':
                action.data.unset.observe(data._ID, data._FILE, data._USER);
                break;

            case 'getContent': 
                ws.send(action.data.actions.fileContent(data._USER, data._FILE))
                break;

            case 'checkPwd':
                if (action.data.files[data._USER]
                    && action.data.files[data._USER].find(share => share.filePath ===data._FILE).pwd === data._PWD
                ) {
                    ws.send(action.data.actions.fileContent(data._USER, data._FILE))
                } else {
                    ws.send(action.data.actions.wrongPwd());
                }
                break;
            
            // the user want his own content, maybe to share it thourh an editor
            case 'BPMNgetMyContent':
                ws.send(action.data.actions.myFileContent(data._ID, data._FILE))
                break;
            case 'BPMNupdateMyContent':
                synchazard.subcast(
                    // subscribers
                    action.data.set.updateSharedFile(data._ID, data._FILENAME, data._CONTENT),
                    action.data.actions.newContent(data._ID, data._FILENAME)
                );
                break;

            default: break;
        }
    })
    // eslint-disable-next-line no-unused-vars
    .onDisconnect((data, ws) => {
        action.data.unset.userFiles(data._ID);
        synchazard.otherscast(data._ID, action.data.actions.sharedFiles());
        //
        // on disconnection update the list removing the user and all his files
        // then broadcast the updated list
        // every client will have to remove those ones that he is looking at
        // and have been removed
        // console.log('dis-connecting');
        // console.log(data);
    })
    .start();

};
