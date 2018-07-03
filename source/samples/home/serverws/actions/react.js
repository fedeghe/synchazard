module.exports.launch = (action, synchazard, params) => {

    "use strict";
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'status',
                    _PAYLOAD: {
                        time : new Date
                    }
                }));
                break;
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
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'status',
            _PAYLOAD: {
                time: t
            }
        }));
    }, 1000).run();
};