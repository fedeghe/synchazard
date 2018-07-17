(function () {
    "use strict";

    function DC() { }

    DC.prototype.set = function (buttonID, resultID) {
        this.button = document.getElementById(buttonID);
        this.result = document.getElementById(resultID);
        this.button.addEventListener('click', function () {
            $NS$.send({
                _ACTION: 'askMontecarlo'
            });
        });
    };

    DC.prototype.handle = function (d) {
        if ($NS$.id !== d._ID) {
            if (confirm('Want to help a fellow client to compute π?')) {
                $NS$.send({
                    _ACTION: 'acceptedMontecarlo'
                });
            } else {
                alert('Got it!... thanks anyway!');
            }
        }
    };

    $NS$.handlers.DistComp = new DC();

    $NS$.handlers.DistCompSendResult = function (data) {
        $NS$.send({
            _ACTION: 'joinMontecarlo',
            _DATA: data
        });
    };
    $NS$.handlers.DistCompSayThx = function (data) {
        console.log(data._MSG);
    };
    $NS$.handlers.DistCompConsumeResult = function (data) {
        /**
         * here we filter the message on the client,
         * if the local cli id is not the one given by the server (the original requesting client id)
         * 
         * if we remove the condition, all connected clients will show the possible most precise pi value
         */
        // if (data._ID === $NS$.id) {
            $NS$.handlers.DistComp.result.innerHTML = '<span style="font-family:times">&pi;</span> &asymp; ' + data._DATA;
        // }
    };
})();
