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
        console.log(`- filename: ${filename}`);
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

                /* checkActors ? */
                const checkActors = $CHECK_ACTORS$;
                if (
                    checkActors &&
                    (!data.___ACTORS || data.___ACTORS.split(',').indexOf(self.actors) < 0)
                ) {
                    console.log(['Actors not matching:', 'expected', self.actors, 'to be in', data.___ACTORS].join(' '));
                    return;
                }
                console.log(['Actors matching:', self.actors, 'found in', data.___ACTORS].join(' '));

                /* forward injecting also the ws, with the id attached */
                ws.id = data.___ID;
                f(data, ws);
            });
        });   
    }
}

module.exports = Action; 