/**
 * The websocket server
 * 
 * 
 */
const WebSocket = require('ws'),
    Action = require('./Action');

module.exports = (function () {

    "use strict";

    let debug = function () {};
    const port = $DATASERVER.WSPORT$,
        srvCnf = {port: port},

        /**
         * start the socket server
         */
        wss = new WebSocket.Server(srvCnf),

        /**
         * Broadcast to all connected clients
         */
        broadcast = (data) => {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: false });
                }
            });
        },

        /**
         * Send back something only to the sender
         */
        send = (data) => {
            wss.on('connection', function connection(ws) {
                ws.on('message', function incoming(data) {
                    wss.clients.forEach(function each(client) {
                        if (client === ws && client.readyState === WebSocket.OPEN) {
                            client.send(data, { binary: false });
                        }
                    });
                });
            });
        },

        // let define the debug level function 
        //
        defineDebugFunction = (args) => {
            if (!args.length) return;
            const match = args[0].match(/-(v+)/);
            if (match) {
                debug = ((maxLevel) => {
                    return function (msg, level) {
                        level = typeof level !== 'undefined' ? level : 0;
                        (
                            level <= maxLevel
                            ||
                            (level === '' && maxLevel > 0)
                        ) && console.log(`DBG ${level}`, msg);
                    }
                })(match[1].length);
            }
        },

        /**
         * @actions array the array of all the Action wrappers to be launched
         */
        launch = (actions, args) => {
            defineDebugFunction(args);
            actions.forEach(params => {
                if (!params.path) throw new Error('No path for action');
                const a = require('../' + params.path),
                    actors = params.actors,
                    action = new Action(exp, actors, debug);
                debug('> ' + params.path.split('/').pop() + '.js started', 1);
                a.launch(action, exp, params);
            });
        },

        exp = {
            wss: wss,
            send: send,
            launch: launch,
            broadcast: broadcast,
            debug: debug
        };

    /**
     * stay
     */
    function heartbeat() { this.isAlive = true; }
    wss.on('connection', function connection(ws) {
        ws.isAlive = true;
        ws.on('pong', heartbeat);
        
        /**
         * handle client death: 
         * this save the server from suddendeath of all clients that
         * does not trigger the "beforeunload" event, then the connection
         * hangs and the we server crash.
         * conterproof:
         * - comment the following line
         * - connect with safari mobile
         * - shut down the browser
         * >>> ws server crashes
         */
        ws.on('error', (e) => {
            console.log(e)
            console.log('SuddenDeath client');
        });
    });
    return exp;
})();

console.log('$START_MESSAGE.WSERVER$');