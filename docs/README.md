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
                    synchazard.broadcast(action.encodeMessage({
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

    SH.send(action.encodeMessage({... here our message object ...}))  

to broadcast a message to all connected clients instead we should use:

    synchazard.broadcast(action.encodeMessage({... here our message object ...}));

...to be continuedrite che code contained in the injected script
</script>
```
now _myHandler.js_ will define in `SH.handlers` all consumers needed in that document

```
(function () {
    SH.handlers.handlerOne = function (data) {
        // use data on DOM as needed
    };
    SH.handlers.handlerTwo = function (data) {};
    
    // but even an instance (standing it implements the `handle` function)
    function myObj(){}
    myObj.protptype.handle = function (data) {
        // use data as needed
    };
    SH.handlers.handlerThree = new myObj();
})();
```

at that point it makes sense to show how the worker code would fit that particular example:

```
"use strict";

var worker = this;

worker.onmessage = function (e) {
    if (e.data._TYPE === 'action') {
        switch (e.data._ACTION) {
            case 'one':
                worker.postMessage({
                    _HANDLER: 'handlerOne',
                    _DATA: e.data._PAYLOAD
                });
                break;
            case 'two':
                worker.postMessage({
                    _HANDLER: 'handlerTwo',
                    _DATA: e.data._PAYLOAD
                });
                break;
            //
            // ....
            //
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};
```
but the worker could for example forward some data that retrieves asynchronously using the data received.