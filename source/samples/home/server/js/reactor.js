/**
 *
 */
(function () {
    'use strict';
    var head = document.getElementsByTagName('head')[0];

    function remove () {
        head.removeChild(this);
    }
    $NS$.utils.loadScript('/js/handlers/incremental.js', remove);
    $NS$.utils.loadScript('/js/handlers/reactor.js', remove);

    function launchReactor () {
        $NS$.handlers.Reactor.auto();
    }
    window.addEventListener('load', launchReactor);
})();
