/**
 * The websocket server
 * 
 * 
 */


let debug = () => {},
    // 
    // the exported obj
    synchazard;

 const WebSocket = require('ws'),
    Action = require('./Action'),
    port = maltaV('DATASERVER.WSPORT'),

    /**
     * start the web socket server
     */
    wss = new WebSocket.Server({ port }),

    /**
     * EXPORTED
     * Broadcast to ALL connected clients
     */
    broadcast = data => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    _ids.push(client.id);
                    client.send(data, { binary: false });
                }
            });
            resolve(_ids);
        });
    },

    /**
     * EXPORTED
     * subcast: only to the given ids array set
     */
    subcast = (ids, data) => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => {
                if (ids.search(client.id) >= 0 && client.readyState === WebSocket.OPEN) {
                    _ids.push(client.id);
                    client.send(data, { binary: false });
                }
            });
            resolve(_ids);
        });
    },

    /**
     * EXPORTED
     * unicast: toward a single client, by id
     * 
     * if the id passed is the id of the onconnection source then
     * this is equivalent of using the ws.send (without passing the id)
     */
    unicast = (id, data) => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => {
                if (client.id === id && client.readyState === WebSocket.OPEN) {
                    _ids.push(client.id);
                    client.send(data, { binary: false });
                }
            });
            resolve(_ids);
        });
    },

    /**
     * EXPORTED
     * otherscast: to all but the given id
     */
    otherscast = (id, data) => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => {
                if (client.id !== id && client.readyState === WebSocket.OPEN) {
                    _ids.push(client.id);
                    client.send(data, { binary: false });
                }
            });
            resolve(_ids);
        })
    },

    /**
     * EXPORTED
     * subexcludecast: toward all but the given ids array set
     */
    subexcludecast = (ids, data, cb) => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => {
                if (ids.search(client.id) < 0 && client.readyState === WebSocket.OPEN) {
                    _ids.push(client.id);
                    client.send(data, { binary: false });
                }
            });
            resolve(_ids);
        })
    },

    // let define the debug level function 
    //
    defineDebugFunction = (args) => {
        if (!args.length) return;
        const match = args[0].match(/-(v+)/);
        if (match) {
            debug = ((maxLevel) => {
                return (msg, level) => {
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
                /**
                 * create the action
                 */
                action = new Action(synchazard, actor, debug);
            debug(`> ${  params.path.split('/').pop()  }.js started`, 1);
            
            a.launch(action, synchazard, params);
        });
    };

synchazard = {
    wss,
    launch,
    broadcast,
    otherscast,
    subcast,
    subexcludecast,
    unicast,
    debug,
    WATCH_INTERVALS: {
        SHORT: 500,
        MEDIUM: 2000,
        LONG: 5000
    }
};

/**
 * stay
 */

wss.on('close', (/* ws */) =>  {
    console.log('close')
})
wss.on('connection', (ws, req) => {
    /**
     * could happen that the host is not allowed to point here,
     * this is the checkpoint
     */
    if (req.headers.origin.search("maltaV('WEBSERVER.HOST')") !== 0) {
        this.isAlive = false;
        ws.terminate();
        console.log(`${req.headers.origin} is not allowed to request here.`);
    }
    ws.isAlive = true;
    ws.on('pong', () => { this.isAlive = true; });
    
    /**
     * handle client death: 
     * this save the server from suddendeath of all clients that
     * does not trigger the "beforeunload" event, then the connection
     * hangs and the ws server crash.
     * counterproof:
     * - comment the following line
     * - connect with safari mobile
     * - shut down the browser
     * >>> ws server crashes
     */
    ws.on('error', e => {
        console.log(e)
        console.log('SuddenDeath client');
    });
});

module.exports = synchazard;

console.log(`maltaV('START_MESSAGE.WSERVER')`);