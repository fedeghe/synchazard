"use strict";
class Action{
    constructor(ss, actor, debug) {
        this.ss = ss;
        this.actor = actor;
        this.debug = debug;
        this.data = {};
    }
    setup(d) {this.data = d || {};}
    getTime() {
        var d = new Date(),
            n = d.getTimezoneOffset();
        return +d + n * 60000;
    }
    encodeMessage(action, id) {
        action._TYPE = 'action';
        action._ACTOR = this.actor;
        //time
        action._TIME = this.getTime();
        if (id) action._ID = id;
        return JSON.stringify(action);
    }
    notify(filename, data) {
        if ($NOTIFY_ACTORS_CHECKING$) {
            console.log("\n--- ACTION NOTIFICATION:");
            console.log(`@ ${new Date}`);
            console.log(`- Action filename: ${filename}`);
            console.log('- data: ');
            console.dir(data);
            console.log("-----\n");
        }
    }
    decodeMessage(action) {return JSON.parse(action);}
    onconnection(f) {
        var self = this;
        this.ss.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                data = JSON.parse(data);

                /* checkActors ? */
                const checkActors = $CHECK_ACTORS$;
                if (checkActors) {
                    if (!data._ACTORS || data._ACTORS.split(',').indexOf(self.actor) < 0) {
                        if ($NOTIFY_ACTORS_CHECKING$){
                            console.log(['Actors not matching:', 'expected', self.actor, 'to be in', data._ACTORS].join(' '));
                            console.log('... the message will not be forwarded');
                        }
                        return;
                    } else {
                        $NOTIFY_ACTORS_CHECKING$ &&
                        console.log(['Actors matching:', self.actor, 'found in', data._ACTORS].join(' '));
                    }
                }
                /* forward injecting also the ws, with the id attached */
                ws.id = data._ID;
                f(data, ws);
            });
        });   
    }
}

module.exports = Action; 