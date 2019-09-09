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
     * PRIVATE
     * send data to 'to' (might be one or more)
     * if the passed function 'func' will return true
     * when receiving (to, data, client)
     */
    xsend = (to , data , func) => {
        const _ids = [];
        return new Promise(resolve => {
            wss.clients.forEach(client => (
                func(to, data, client)
                && client.readyState === WebSocket.OPEN
                && _ids.push(client.id)
                && client.send(data, { binary: false })
            ));
            resolve(_ids);
        });  
    },

    /**
     * EXPORTED
     * Broadcast to ALL connected clients
     */
    broadcast = data => xsend(null, data, () => true),

    /**
     * EXPORTED
     * subcast: only to the given ids array set
     */
    subcast = (ids, data) => xsend(
        ids,
        data,
        (i, d, cli) => i.includes(cli.id)
    ),

    /**
     * EXPORTED
     * unicast: toward a single client, by id
     * 
     * if the id passed is the id of the onconnection source then
     * this is equivalent of using the ws.send (without passing the id)
     */
    unicast = (id, data) => xsend(
        id,
        data,
        (i, d, cli) => cli.id === i
    ),

    /**
     * EXPORTED
     * otherscast: to all but the given id
     */
    otherscast = (id, data) => xsend(
        id,
        data,
        (i, d, cli) => cli.id !== i
    ),

    /**
     * EXPORTED
     * subexcludecast: toward all but the given ids array set
     */
    subexcludecast = (ids, data) => xsend(
        ids,
        data,
        (i, d, cli) => !(i.includes(cli.id))
    ),

    // let define the debug level function 
    //
    defineDebugFunction = args => {
        if (!args.length) return;
        const match = args[0].match(/-(v+)/);
        if (match) {
            debug = (maxLevel => (msg, level) => {
                level = typeof level !== 'undefined' ? level : 0;
                (
                    level <= maxLevel
                    ||
                    (level === '' && maxLevel > 0)
                ) && console.log(`DBG ${level}`, msg);
            })(match[1].length);
        }
    },

    /**
     * @actions array the array of all the Action wrappers to be launched
     */
    launch = (actionsParams, args) => {
        defineDebugFunction(args);
        actionsParams.forEach(actionParams => {
            if (!actionParams.path) throw new Error('No path for action');
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const a = require(`../${actionParams.path}`),
                {actor} = actionParams,
                /**
                 * create the action
                 */
                action = new Action(synchazard, actor, debug);

            debug(`> ${actionParams.path.split('/').pop()}.js action running`, 1);
            a.launch(action, synchazard, actionParams);
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
     * - comment the following error handler
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