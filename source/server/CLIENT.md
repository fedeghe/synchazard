### The events flow on the client

A client page loads the synchazard.js (not meant to be modified) passing within the script tag one information about which worker file to use (this should be implemented), something like: 
```
<script src="/pathTo/synchazard.js"
    data-worker="/pathTo/webWorker.js"></script>
```
Here is an ordered list of what the `synchazard` script will do: 
1) in the global namespace defines an object `$NS$` which will:
    - create and hold a reference to **one webWorker** (from the data-worker attrsibute) that will be responsible to define the routing of all incoming data toward handling functions or object instances (thats implements a `handle` function)
    - mantain needed references to all handling functions & instances
    - expose:
        - a send function meant to be used to communicate with the server (through the ws created at step #2)
        - two injection functions for scripts and stylesheets
        - the ~unique identifier of the client

2) starts and incapsulate the webSocket connection to the server, offering a `$NS$.send` method necessary for the client to send message to the socket Server when needed, this wrapper method attaches a unique identifier of the client (there is still an extremely remote chance of clientId collision)
3) Intercept all messages incoming through the webSocket toward the client and forward to the webworker, decoded as json
4) When the connection is successfully established sends an `init` request through the webSocket
5) Attempt to reconnect when the connection is lost for any reason (some config options are available in the vars.json build file) 
6) Offers a couple of functions to pause & resume any data flow. 
7) Handle an optional parameter that can be passed to the script tag as attrbute which allows to avoid message collision; this topic is the only solution I found when I realized that the webSocket server can run many scripts which could all reply to, for example, a init request and the answer could collide between different clients running different workers. I'll get back to this topic after describing how the server-side of _Synchazard_ is working. 

#### Handlers functions and instances
As should be clear the webworker is meant in the simplest case to almost forward the data toward the right consumer or _handler_. But where should this _handlers_ be defined? ... in a script! ... similar to the following one:
```
<script>
    // here $NS$ is available and loadScript can be useful    
    $NS$.utils.loadScript('/js/handlers/myHandler.js');
    // btw, is possible to directly write che code contained in the injected script
</script>
```
now _myHandler.js_ will define in `$NS$.handlers` all consumers needed in that document

```
(function () {
    $NS$.handlers.handlerOne = function (data) {
        // use data on DOM as needed
    };
    $NS$.handlers.handlerTwo = function (data) {};
    
    // but even an instance (standing it implements the `handle` function)
    function myObj(){}
    myObj.protptype.handle = function (data) {
        // use data as needed
    };
    $NS$.handlers.handlerThree = new myObj();
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