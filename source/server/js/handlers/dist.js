(function () {
    "use strict";
    
    function DC() {}
    
    DC.prototype.set = function (buttonID, resultID){
        this.button = document.getElementById(buttonID);
        this.result = document.getElementById(resultID);
        this.button.addEventListener('click', function () {
            $NS$.send({
                ___TYPE: 'action',
                ___ACTION: 'askMontecarlo'
            });
        });
    };

    DC.prototype.handle = function (d) {
        if ($NS$.id !== d.___ID) {
            if (confirm('Want to help a fellow client to compute π?')){
                $NS$.send({
                    ___TYPE: 'action',
                    ___ACTION: 'acceptedMontecarlo'
                });
            } else {
                alert('Got it!... thanks anyway!');
            }
        }
    };

    $NS$.handlers.DistComp = new DC();

    $NS$.handlers.DistCompSendResult = function (data) {
        $NS$.send({
            ___TYPE: 'action',
            ___ACTION: 'joinMontecarlo',
            ___DATA: data
        });
    };
    $NS$.handlers.DistCompConsumeResult = function (data) {
        /**
         * here we filter the message on the client,
         * if the local cli id is not the one given by the server (the original requesting client id)
         * 
         * if we remove the condition, all connected clients will show the possible most precise pi value
         */
        if (data.___ID === $NS$.id){
            $NS$.handlers.DistComp.result.innerHTML = data.___DATA;
        }
    };
})();
