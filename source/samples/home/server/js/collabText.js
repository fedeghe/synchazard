/**
 * Just publish a render function that accepts a Object
 * 
 * for simplicity here will just render its content in a DOMnode
 */
(function () {
    "use strict";
    function launchCollabText() {
        $NS$.utils.loadScript('/js/handlers/collabText.js', function () {
            $NS$.handlers.Collab.add(document.getElementById('trg'));
            $NS$.handlers.Collab.add(document.getElementById('trg2'));
        });
    }
    window.addEventListener("load", launchCollabText);
})();