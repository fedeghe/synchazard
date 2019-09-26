(function () {
    maltaV('NS').handlers.sunshine = function (d) {
        document.body.style.background= 'linear-gradient(to bottom,' + d.join(',') + ')';
    }
}());
