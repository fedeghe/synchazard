const time = () => ((new Date).getTime());

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

module.exports = Interval;
