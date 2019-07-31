### The events flow on the (socket) server

The server-side of _Synchazard_ is composed by two main elements:
1) a wrapper object of the `ws` dependency that after starting the server allows to start one or more _Actions_. This is the file `serverws/core/synchazard.js`
2) the `Action` is a javascript class that basically setup a useful wrapper on those files that will define how the socket server should act when some events occur. Those events could be for example when something relevant happens on a db, when a client sends a message, a webhook call, anything observable programmatically. This file is the `serverws/core/Action.js`

Both are not meant to be modified.

The juice are the files that I called _Actions_ that will be launched using a method offered by the `synchazard`. Those actions will receive a brand new Action injected in the only method mandatory.
Then name of the methods, one to launch all implemented Actions (in the synchazard) and the other to actually run the Actions is the same: `launch`. So the script that will run the socket server will most likely be similar to the following:
```
const fs = require('fs'),
    path = require('path'),
    socketsSrv = require('./core/synchazard'),

    // get args if any
    argz = process.argv.slice(2);

/**
 * launch all actions passing if found other parameters to activate debug
 */
socketsSrv.launch([{
        path: 'actions/myAction',
        deps: { fs: fs, path: path }
    },
    ...
    ... more actions if needed
    ... 
], argz);
```

then `actions/myAction.js` could look like:

```
module.exports.launch = (action, synchazard, params) => {
    "use strict";
    // just listen
    //
    action.onconnection((data, ws) => {

        if (data._TYPE === 'action') {
            switch (data._ACTION) {
                case 'init':
                    synchazard.broadcast(action.encode({
                        _ACTION: 'messages',
                        _PAYLOAD: {
                            all : action.data.messages
                        }
                    }));
                    break;
                
                //
                // all other needed cases
                //

                default: break;
            }
        }
    });
};
```

here to send a unicast message to the client that connected we should use:

    const act = action.encode({... our message object ...}
    maltaV('NS').send(act))  

to broadcast a message to all connected clients instead we should use:

    synchazard.broadcast(act);

to send a message to all clients but the sender

    synchazard.otherscast(act);

to send a message to a specific client set (we have to know the ids)

    synchazard.subcast([id1, id2, ...], act);

to send a message to all excluding a specific client set (we have to know the ids)

    synchazard.subexcludecast([id1, id2, ...], act);
    
to send a message to a specific client (we must know the id)  

    synchazard.unicast(id, act);




...to be continued