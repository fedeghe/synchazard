(function () {
    "use strict";
    var trg = document.getElementById('number');
    function render2(d) {
        trg.innerHTML = d.num;
    }
    $NS$.handlers.render2 = render2;
}());
