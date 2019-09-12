var injectBPMN = (function () {
    var script = null,
        head = document.getElementsByTagName('head').item(0);
    return function(mode, then) {
        var urls = {
            // viewer:'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-viewer.production.min.js',
            viewer:'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-navigated-viewer.production.min.js',
            modeler:'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-modeler.production.min.js',
        };

        if (mode.match(/viewer|modeler/)) {
            if (script) {
                head.removeChild(script);
            }
            script = document.createElement('script');
            script.onload = then;
            script.src = urls[mode];
            head.appendChild(script);
        }
    };
})();

