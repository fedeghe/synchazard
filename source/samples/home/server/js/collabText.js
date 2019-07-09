/**
 *
 */
(function () {
    function launchCollabText () {
        maltaV('NS').utils.loadScript('/js/handlers/collabText.js', function () {
            maltaV('NS').handlers.Collab.add(document.getElementById('trg'));
            maltaV('NS').handlers.Collab.add(document.getElementById('trg2'));
        });
    }
    window.addEventListener('load', launchCollabText);
})();
