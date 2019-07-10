/**
 * The websocket server
 * 
 * 
 */
const WebSocket = require('ws'),
    Action = require('./Action');

module.exports = (function () {

    

    let debug = function () {};
    const port = maltaV('DATASERVER.WSPORT'),
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
         * unicast torawrd a single client, by id
         */
        unicast = (id, data) => {
            wss.clients.forEach((client) => {
                if (client.id === id && client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: false });
                }
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
                // eslint-disable-next-line import/no-dynamic-require, global-require
                const a = require(`../${params.path}`),
                    {actor} = params,
                    // eslint-disable-next-line no-use-before-define
                    action = new Action(exp, actor, debug);
                debug(`> ${  params.path.split('/').pop()  }.js started`, 1);
                // eslint-disable-next-line no-use-before-define
                a.launch(action, exp, params);
            });
        },

        exp = {
            wss: wss,
            launch: launch,
            broadcast: broadcast,
            unicast: unicast,
            debug: debug,
            "WATCH_INTERVALS": {
                "SHORT": 500,
                "MEDIUM": 2000,
                "LONG": 5000
            }
        };

    /**
     * stay
     */
    function heartbeat() { this.isAlive = true; }
    wss.on('close', function connection(/* ws */) {
        console.log('close')
    })
    wss.on('connection', function connection(ws, req) {
        if (req.headers.origin.search("maltaV('WEBSERVER.HOST')") !== 0) {
            ws.terminate();
            console.log(`${req.headers.origin} is not allowed to request here.`);
        }
        ws.isAlive = true;
        ws.on('pong', heartbeat);
        
        /**
         * handle client death: 
         * this save the server from suddendeath of all clients that
         * does not trigger the "beforeunload" event, then the connection
         * hangs and the we server crash.
         * counterproof:
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

console.log(`maltaV('START_MESSAGE.WSERVER')`);