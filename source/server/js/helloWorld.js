(function () {
    "use strict";
    var head = document.getElementsByTagName('head')[0];

    function remove() {
        head.removeChild(this);
    }
    $NS$.utils.loadScript('/js/handlers/helloWorld.js', remove);
})();