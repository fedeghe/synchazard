(function () {
    maltaV('NS').handlers.computer = function (f) {
        var func = maltaV('NS').utils.decodeFunction(f.func),
            trg = document.getElementById('trg'),
            i = 0;

        for (null; i < 100; i++) {
            // eslint-disable-next-line no-loop-func
            (function(j){
                var el = document.createElement('div'),
                    desc = f.desc.replace('$p', j);
                el.innerHTML = desc + ' = ' + func(j);
                trg.appendChild(el);
            })(i);
        }
    }
}());