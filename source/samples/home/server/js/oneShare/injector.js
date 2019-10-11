var injectBPMN = (function () {
    var script = null,
        head = document.getElementsByTagName('head').item(0);
    return function(mode, then) {
        var viewer = 'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-navigated-viewer.production.min.js',
        // var viewer = 'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-modeler.production.min.js',
            modeler = 'https://cdn.jsdelivr.net/npm/bpmn-js@5.0.4/dist/bpmn-modeler.production.min.js',
            urls = {
                viewer: viewer,
                modeler: modeler
            };

        if (mode.match(/viewer|modeler/)) {
            if (script) {
                head.removeChild(script);
            }
            script = document.createElement('script');
            script.onload = then;
            script.src = urls[mode];
            head.appendChild(script);
        } else {
            script && head.removeChild(script);
        }
    };
})();

