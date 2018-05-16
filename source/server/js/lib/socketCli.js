(function () {

    "use strict";
    
    if (!("WebSocket" in window))
        throw new Error('No WebSockets available on client side!');
    
    var ws = false,
        /**
         * serialized action that can be used to ask the server
         * for initialization information, is up to us to decide how to call it.
         * the only important thing is that the socket server knows how to handle/reply to it
         */
        initAction = {
            ___TYPE: 'action',
            ___ACTION: 'init',
            ___ID: $NS$.id
        },
        noop = function () {},
        init = noop,
        send = noop,
        reconnectionAttempts = 0,
        maxReconnectionAttempts = $SERVER.RECONNECTION.ATTEMPTS$,
        reconnectionInterval = $SERVER.RECONNECTION.INTERVAL$,
        url = null;

    /**
     * create a named IIFE to start the connection so that from 
     * inside of it we can call it if needed
     */
    (function startWs() {

        ws && ws.close();

        url = "$DATASERVER.WS$/?id=" + $NS$.id;
        /**
         * Attempt to start the client socket
         */
        try {
            ws = new WebSocket(url);
        } catch (err) {
            console.log('WS error:');
            console.log(err);
        }

        /**
         * OPTIONAL
         * 
         * when the socket conn is established, send the simple initAction
         * this function is also exposed to the client through the global scope so that 
         * is possible to trigger the same sending by a user actin for example
         * 
         * is up tp the server to decide what the initAction should trigger
         */
        init = ws.onopen = function (e) {
            console.log(`Connection established with ${e ? e.currentTarget.url : url}`);
            ws.send($NS$.utils.createAction(initAction));
        };

        send = function (action) {
            // ensure the client identifier
            action.___ID = action.___ID || $NS$.id;
            $NS$.active && ws.send($NS$.utils.createAction(action));
        };

        /**
         * whenever the client receives a message through the socket it 
         * just decode and forward the payload to the dataWorker, here further actions will be decided
         * 
         * the socket allows only to pass strings, so if an object is needed (more flexible option)
         * the server is in charge of serialize it, and the worker expects the payload to be unserialized
         * back to an object literal
         */
        ws.onmessage = function (evt) {
            $NS$.active && 
            $NS$.dataWorker.postMessage(
                JSON.parse(evt.data)
            );
        };

        /**
         * a couple of functions just for debugging purposes
         */
        ws.onclose = function (e) {
            console.clear();
            console.log('Connection dropped from server');
            console.log(e);
            console.log(`... attempting reconnection in 5 seconds (#${++reconnectionAttempts})`);
            /**
             * attempt reconnection
             */
            --maxReconnectionAttempts && window.setTimeout(startWs, reconnectionInterval);
        };

        /**
         * handle it somehow
         */
        ws.onerror = function (e) {
            console.log('ws client error');
            console.log(e);
            ws.close();
        };
    }());

    /**
     * let the client close the connection before refresh OR close
     */
    function close() {
        // automatically blur current element
        // on reload otherwise would hang
        //
        document.activeElement.blur();

        // and close the cli
        if (ws) {
            // disable any onclose handler first
            ws.onclose = function () { };
            ws.close();
        }
    }

    /**
     * when the browser is shut down close the socket,
     * this will not work on safari mobile for example,
     * need to ahndle that on the server (see ws.on('error', ...) on socketSrv.js) 
     */
    window.addEventListener("beforeunload", close);
    window.addEventListener("pagehide", close);

    /**
     * publish some meaningful functions in $NS$ namespace
     */
    $NS$.commands.init = init;
    $NS$.utils.send = send;
}());



