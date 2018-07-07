(function () {
    "use strict";
    $NS$.handlers.sunshine = function (d) {
        // console.log(d);
        document.body.style.background= 'linear-gradient(to bottom,' + d.join(',') + ')';
    }
}());
