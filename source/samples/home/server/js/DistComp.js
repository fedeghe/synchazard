/**
 *
 */
(function () {
    'use strict';
    var head = document.getElementsByTagName('head')[0];
    function remove () {
        head.removeChild(this);
    }
    function launchDC () {
        $NS$.handlers.DistComp.set('ask', 'result');
    }
    $NS$.utils.loadScript('/js/handlers/dist.js', remove);
    window.addEventListener('load', launchDC);
})();
