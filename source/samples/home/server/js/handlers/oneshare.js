(function () {
    function OneShare() {}
    OneShare.prototype.handle = function (d) {
        console.log(d
    };
    // eslint-disable-next-line no-undef
    maltaV('NS').handlers.oneShare = new OneShare;
}());