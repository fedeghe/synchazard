### The events flow on the server

The server side of _Synchazard_ is composed by two main elements:
1) a wrapper object of the `ws` dependency that after starting the server allows to start one or more _Actions_. This is the file `dataServer/core/socketSrv.js`
2) the `Action` is a javascript class that basically setup a useful wrapper on those files that will define how the socket server should act when some events occur. Those events could be for example when something relevant happens on a db, when a client sends a message, a webhook call, anything observable programmatically. This file is the `dataServer/core/Action.js`

Both are not meant to be modified.

The juice are the files that I called _Actions_ that will be launched using a method offered by the `socketSrv`. Those actions will receive a brand new Action injected in the only method mandatory.
Then name of the methods, one to launch all implemented Actions (in the socketSrv) and the other to actually run the Actions is the same: `launch`.
