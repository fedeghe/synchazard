/**
 * 
 */
(function () {
    "use strict";
    var head = document.getElementsByTagName('head')[0];

    function remove() {
        head.removeChild(this);
    }

    $NS$.utils.loadScript('/js/handlers/jsonObserver.js');
    $NS$.utils.loadScript('/js/handlers/randomPercentage.js', remove);
    $NS$.utils.loadScript('/js/handlers/style.js', remove);
    $NS$.utils.loadScript('/js/handlers/script.js', remove);

    window.createWatch = function (node) {
        function p2(d) {
            return d > 9 ? d : '0' + d;
        }
        function format (d) {
            return [p2(d.getDate()), p2(d.getMonth()), d.getFullYear()].join('-') +
                 ' @ ' +
                [p2(d.getHours()), p2(d.getMinutes()), p2(d.getSeconds())].join(':')
        }
        setInterval(function () {
            node.innerHTML = format(new Date);
        }, 1000);
    };
})();