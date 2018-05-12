module.exports.launch = (action, socketSrv, params) => {

    "use strict";
    action.onconnection((data, ws) => {
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'init':
                    console.log(`init ${__filename}`)
                    ws.send(action.encodeMessage({
                        ___TYPE: 'status',
                        ___PAYLOAD: {
                            time : new Date
                        }
                    }));
                    break;
            }
        }
    });

    function time() {
        return (new Date).getTime();
    }

    function Interval(fun, duration) {
        this.startTime = time();
        this.fun = fun;
        this.duration = duration;
    }

    Interval.prototype.run = function () {
        var self = this,
            next = null;
        this.fun();

        this.startTime += this.duration;
        next = this.duration - (time() - this.startTime);
        if (next < 0) next = 0;
        self.timer = setTimeout(function () {
            self.run();
        }, next);
    };
    Interval.prototype.stop = function () {
        clearTimeout(this.timer);
    };

    // RUN
    new Interval(() => {
        var t = new Date;
        socketSrv.broadcast(action.encodeMessage({
            ___TYPE: 'status',
            ___PAYLOAD: {
                time: t
            }
        }));
    }, 1000).run();
};