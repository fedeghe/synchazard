(function () {
    "use strict";
    var trg = document.getElementById('number');
    
    $NS$.handlers.sunshine = function (d) {
        // console.log(d);
        document.body.style.background= 'linear-gradient(to bottom,' + d.join(',') + ')';
    }
}());
