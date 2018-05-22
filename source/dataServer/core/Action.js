"use strict";
class Action{
    constructor(ss, actors, debug) {
        this.ss = ss;
        this.actors = actors;
        this.debug = debug;
        this.data = {};
    }
    setup(d) {this.data = d || {};}
    encodeMessage(action, id) {
        action.___TYPE = 'action';
        action.___ACTORS = this.actors;
        if (id) action.___ID = id;
        return JSON.stringify(action);
    }
    notify(filename, data) {
        console.log("\n--- ACTION NOTIFICATION:");
        console.log(`@ ${new Date}`);
        console.log(`- filename: ${filename}`)
        console.log('- data: ');
        console.dir(data);
        console.log("-----\n");
    }
    decodeMessage(action) {return JSON.parse(action);}
    onconnection(f) {
        var self = this;
        this.ss.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                data = JSON.parse(data);

                const checkActors = !!$DATASERVER.CHECKACTORS$,
                    enforceActorsMatch = !!$SHARED.ENFORCEACTORS$;
                /**
                 * if the checkActors is enabled on socket srv
                 * then maybe shut it now cause the actors are given and do not match
                 */ 
                if (
                    /**
                     * this first condition makes the data-actor optional on the client,
                     * thus that check will not shut incoming connection requests from 
                     * client that do NOT specify an actors list.
                     * ...but if they are used they should contain one or more of the action's actors
                     * specified in the dataServer/ws_srv.js, depending on which ones are needed in the page
                     * 
                     * if this condition is removed instead, then the client MUST specify the right actors
                     * otherwise the connection will not be accepted
                     *
                     *
                     * make the actors optional
                     * yeah is falsy and is perfet as it is
                     */
                    checkActors &&
                    enforceActorsMatch &&
                    data.___ACTORS.split(',').indexOf(self.actors) < 0
                ) return;
                // console.log(data)
                ws.id = data.___ID;
                /* forward injecting also the ws, with the id attached */
                f(data, ws);
            });
        });   
    }
}

module.exports = Action; 