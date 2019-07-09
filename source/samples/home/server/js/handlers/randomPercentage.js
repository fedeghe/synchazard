/* eslint-disable no-undef */
(function () {
    maltaV('NS').utils.loadScript(
        '/js/simpleCanvasGrph.js',
        function () {
            var trg = document.querySelector('.graph'),
                gr = Scg.create().render(trg);

            maltaV('NS').handlers.render3 = function (d) {
                gr.addPoint(d.num);
            };
        }
    );
})();