/**
 *
 */
(function () {


    function createShareArea()  {}

    function createUi(trg) {
        var shareArea = document.createElement('div'),
                shareAreaDrop = document.createElement('div'),
                shareAreaButtons = document.createElement('div'),

            contentArea = document.createElement('div'),
                contentAreaSelect = document.createElement('div'),
                contentAreaTab = document.createElement('div'),
                contentAreaTabTongues = document.createElement('div'),
                contentAreaTabContent = document.createElement('div'),

         t = document.querySelector('.tabTongue');
        t.addEventListener('click', function (e) {
            console.log(e)
        })

    }


    window.addEventListener('load', function () {
        var target = document.getElementById('target');
        createUi(target);
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
