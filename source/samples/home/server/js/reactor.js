/**
 *
 */
(function () {
    var head = document.getElementsByTagName('head')[0];

    function remove () {
        head.removeChild(this);
    }
    maltaV('NS').utils.loadScript('/js/handlers/incremental.js', remove);
    maltaV('NS').utils.loadScript('/js/handlers/reactor.js', remove);

    function launchReactor () {
        maltaV('NS').handlers.Reactor.auto();
    }
    window.addEventListener('load', launchReactor);
})();
