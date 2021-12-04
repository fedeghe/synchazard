/* eslint-disable no-undef */
(function (W) {

    if (!("WebSocket" in W)) {
        throw new Error('No WebSockets available on client side!');
    }
    
    // eslint-disable-next-line vars-on-top
    var ws = false,
        noop = function () {},
        init = noop,
        send = noop,
        reconnectionAttempts = 0,
        maxReconnectionAttempts = maltaV('WEBSERVER.RECONNECTION.MAXATTEMPTS'),
        reconnectionInterval = maltaV('WEBSERVER.RECONNECTION.INTERVAL'),
        url = null;

    /**
     * create a named IIFE to start the connection so that from 
     * inside of it we can call it if needed
     */
    (function startWs() {

        // in case is up and running then shut it down
        ws && ws.close();

        // pass the client id 
        url = "maltaV('DATASERVER.WSHOST')/?id=" + maltaV('NS').id;

        // attempt to start the client socket
        try {
            ws = new WebSocket(url);
        } catch (err) {
            console.log('WS error:');
            console.log(err);
        }

        /**
         * OPTIONAL
         * 
         * when the socket conn is established, send the simple 'init' request
         * this function is also exposed to the client through the global scope so that 
         * is possible to trigger the same sending by a user action for example
         * 
         * is up tp the server to decide what the initAction should trigger
         */
        // eslint-disable-next-line no-multi-assign
        init = ws.onopen = function (){
            maltaV('NS').utils.ready(function(){
                console.log('Connection established with ' + url + ', sending init req');
                ws.send(maltaV('NS').utils.createInitAction());
            });
        };

        /**
         * wrap the ws.send adding some useful stuff (before check active flag)
         */
        send = function (action) {
            maltaV('NS').active && ws.send(maltaV('NS').utils.createAction(action));
        };

        /**
         * whenever the client receives a message through the socket it 
         * just decode and forward the payload to the synchazard (the webworker, check ~ln26 of source/server/js/lib/workerSetup.js),
         * here further actions will be decided
         * 
         * the socket allows only to pass strings, so if an object is needed (more flexible option)
         * the server is in charge of serialize it, and the worker expects the payload to be unserialized
         * back to an object literal
         */
        ws.onmessage = function (evt) {
            maltaV('NS').active && 
            maltaV('NS').synchazard.postMessage(
                evt.data ? JSON.parse(evt.data) : {}
            );
        };

        /**
         * a couple of functions just for debugging purposes
         */
        ws.onclose = function (e) {
            ++reconnectionAttempts;
            console.clear();
            console.log('Connection dropped from server');
            console.log(e);
            console.log('... attempting reconnection in 5 seconds #' + reconnectionAttempts);
            /**
             * attempt reconnection
             */
            --maxReconnectionAttempts && W.setTimeout(startWs, reconnectionInterval);
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
    function close( /* e */ ) {
        // NOT NEEDED
        // e.preventDefault();
        // Chrome requires returnValue to be set
        // e.returnValue = '';
        
        /**
         * automatically send the close client action 
         * allowing the server to be updated about which client is on which page
         */
        ws && ws.send(maltaV('NS').utils.createCloseAction());
        /**
         * automatically blur current element
         * on reload otherwise would hang
         */
        document.activeElement.blur();
        /**
         * and close the cli
         */
        if (ws) {
            /**
             * disable any onclose handler first
             */
            ws.onclose = function () { };
            ws.close();
        }
    }

    /**
     * when the browser is shut down close the socket,
     * this will not work on safari mobile for example,
     * need to handle that on the server (see ws.on('error', ...) on synchazard.js) 
     */
    W.addEventListener("beforeunload", close);
    W.addEventListener("pagehide", close);

    /**
     * publish some meaningful functions in maltaV('NS') namespace
     */
    maltaV('NS').commands.init = init;
    maltaV('NS').send = send;
})(this);



