(function () {
    "use strict";
    var head = document.getElementsByTagName('head')[0];

    function remove() {
        head.removeChild(this);
    }

    $NS$.utils.loadScript('/js/handlers/dist.js', remove);
    
    function launchDC() {
        $NS$.handlers.DistComp.set('ask', 'result');
    }
    window.addEventListener("load", launchDC);

})();