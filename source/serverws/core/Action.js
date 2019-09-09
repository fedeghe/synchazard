/* eslint-disable class-methods-use-this */


class Action{
    constructor(ss, actor, debug) {
        this.ss = ss;
        this.actor = actor;
        this.debug = debug;
        this.onConnectionHandler = null;
        this.onCloseHandler = null;
        this.data = {};
    }

    setup(d) {this.data = d || {}; return this;}

    getCount() { return Action.count;}

    getSize(url) {
        const cnt = Action.count.URL[url];
        return cnt ? cnt.length : 0;
    }

    getTime() {
        var d = new Date(),
            n = d.getTimezoneOffset();
        return +d + n * 60000;
    }

    encode(action, options) {
        action._TYPE = 'action';
        action._ACTOR = this.actor;
        // time
        action._TIME = action._TIME || this.getTime();
        if (options) {
            if (options.id) action._ID = options.id;
            if (options.data) {
                action._TIME = options.data._TIME;
            }
        }
        return JSON.stringify(action);
    }

    checkRequestActor(data) {
        return data._ACTORS.split(',').includes(this.actor)
    }

    encodeMessage(message, options) {
        message._TYPE = message._TYPE || 'message';
        message._ACTOR = this.actor;
        // time
        message._TIME = message._TIME || this.getTime();
        if (options) {
            if (options.id) message._ID = options.id;
            if (options.data) {
                message._TIME = options.data._TIME;
            }
        }
        return JSON.stringify(message);
    }

    notify(filename, data) {
        if (maltaV('NOTIFY_ACTORS_CHECKING_FAILURE')) {
            console.log("\n--- ACTION NOTIFICATION:");
            console.log(`@ ${new Date}`);
            console.log(`- Action filename: ${filename}`);
            console.log('- data: ');
            console.dir(data);
            console.log("-----\n");
        }
    }

    decodeMessage(action) {return JSON.parse(action);}

    start() {
        var self = this;
        if (this.onConnectionHandler === null) {
            throw new Error({message: 'A onConnectionHandler is needed befor starting the action'})
        }
        this.ss.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                data = JSON.parse(data);

                if (data._TYPE === 'action' && data._ACTION === 'close') {
                    // FIRST !!!!
                    Action.unsetCount(data);
                    // THEN.....
                    self.onCloseHandler && self.onCloseHandler(data, ws, req)
                    return;
                }

                /* checkActors ? */
                const checkActors = true;
                if (checkActors) {
                    if (!data._ACTORS || data._ACTORS.split(',').indexOf(self.actor) < 0) {
                        if (maltaV('NOTIFY_ACTORS_CHECKING_FAILURE')){
                            console.log(['Actors not matching:', 'expected', self.actor, 'to be in [', data._ACTORS.join(', '), ']'].join(' '));
                            console.log('... the message will not be forwarded');
                        }
                        return;
                    } 
                    // maltaV('NOTIFY_ACTORS_CHECKING') &&
                    // console.log(['Actors matching:', self.actor, 'found in', data._ACTORS].join(' '));
                    
                }
                /* forward injecting also the ws, with the id attached */
                ws.id = data._ID;
                Action.setCount(data);
                self.onConnectionHandler(data, ws, req);
            });
        });
        return this;
    }

    onConnect(onConnectionHandler) {
        this.onConnectionHandler = onConnectionHandler;
        return this;
    }

    onDisconnect(onCloseHandler) {
        this.onCloseHandler = onCloseHandler;
        return this;
    }
}

/**
 * There is some STATIC stuff that is needed to keep track exactly about
 * the same information in two different structures:
 * 
 * clientId : [urls,] yeee...will be always one per client
 * url: [clientId, ...]  here will be more
 * 
 * and those are updated everytime a client open a page and move elsewhere
 * (or shut down the bro)
 * 
 * this allows for example in the distrubuted computing example (build:home)
 * to tell to a client that there are no available clients to help him
 * for the calculation
 */
Action.count = {
    ID: {},
    URL: {}
};

Action.setCount = function (data) {
    if (!(data._ID in Action.count.ID)) Action.count.ID[data._ID] = [];
    if (Action.count.ID[data._ID].indexOf(data._URL) < 0) Action.count.ID[data._ID].push(data._URL);
    if (!(data._URL in Action.count.URL)) Action.count.URL[data._URL] = [];
    if (Action.count.URL[data._URL].indexOf(data._ID) < 0) Action.count.URL[data._URL].push(data._ID);
};

Action.unsetCount = function (data) {
    var t = null;
    if (data._ID in Action.count.ID) {
        t = Action.count.ID[data._ID].indexOf(data._URL);
        t >= 0 && Action.count.ID[data._ID].splice(t, 1);
    }
    if (data._URL in Action.count.URL) {
        t = Action.count.URL[data._URL].indexOf(data._ID);
        t >= 0 && Action.count.URL[data._URL].splice(t, 1);
    }
};

module.exports = Action; 