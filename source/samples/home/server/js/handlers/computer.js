(function () {
    "use strict";
    $NS$.handlers.computer = function (f) {
        var func = $NS$.utils.decodeFunction(f.func),
            trg = document.getElementById('trg');

        for (var i = 0; i < 100; i++) (function(j){
            var el = document.createElement('div'),
                desc = f.desc.replace('$p', i);
            el.innerHTML = desc + ' = ' + func(i);
            trg.appendChild(el);
        })(i);
    }
}());