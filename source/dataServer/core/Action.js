"use strict";
class Action{
    constructor(ss, debug) {
        this.ss = ss;
        this.debug = debug;
    }
    setup(d) {this.data = d || {};}
    encodeMessage(o, id ) {
        if (id) o.___ID = id;
        return JSON.stringify(o);
    }
    decodeMessage(o) {return JSON.parse(o);}
    onconnection(f) {
        this.ss.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                data = JSON.parse(data);
                ws.id = data.___ID;
                /* forward injecting also the ws, with the id attache */
                f(data, ws);
            });
        });   
    }
}

module.exports = Action; 