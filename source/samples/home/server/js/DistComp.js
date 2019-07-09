/**
 *
 */
(function () {
    var head = document.getElementsByTagName('head')[0];
    function remove () {
        head.removeChild(this);
    }
    function launchDC () {
        maltaV('NS').handlers.DistComp.set('ask', 'result');
    }
    maltaV('NS').utils.loadScript('/js/handlers/dist.js', remove);
    window.addEventListener('load', launchDC);
})();
