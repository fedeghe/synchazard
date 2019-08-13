/**
 *
 */
(function () {

    function createUi(trg) {
        var shareArea = document.createElement('div'),
            contentArea = document.createElement('div');
    }

    window.addEventListener('load', function () {
        var target = document.getElementById('target');
        createUi(target);
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
