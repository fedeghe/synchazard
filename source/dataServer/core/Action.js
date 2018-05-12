"use strict";
class Action{
    constructor(ss, actors, debug) {
        this.ss = ss;
        this.actors = actors;
        this.debug = debug;
    }
    setup(d) {this.data = d || {};}
    encodeMessage(action, id) {
        action.___ACTORS = this.actors;
        if (id) action.___ID = id;
        return JSON.stringify(action);
    }
    decodeMessage(action) {return JSON.parse(action);}
    onconnection(f) {
        var self = this;
        this.ss.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                data = JSON.parse(data);
                if (data.___ACTORS.split(',').indexOf(self.actors) < 0) return;
                ws.id = data.___ID;
                /* forward injecting also the ws, with the id attache */
                f(data, ws);
            });
        });   
    }
}

module.exports = Action; 