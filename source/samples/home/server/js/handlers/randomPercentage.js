(function () {
    "use strict";
    
    $NS$.utils.loadScript(
        '/js/simpleCanvasGrph.js',
        function () {
            var trg = document.getElementById('graph'),
                gr = Scg.create().render(trg);

            $NS$.handlers.render3 = function (d) {
                gr.addPoint(d.num);
            };
        }
    );
})();