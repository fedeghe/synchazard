(function () {
    "use strict";
    
    function DC() {}
    
    DC.prototype.set = function (buttonID, resultID){
        this.button = document.getElementById(buttonID);
        this.result = document.getElementById(resultID);
        this.button.addEventListener('click', function () {
            $NS$.utils.send({
                ___TYPE: 'action',
                ___ACTION: 'askMontecarlo'
            });
        });
    };

    DC.prototype.handle = function (d) {
        if ($NS$.id !== d.___ID) {
            if (confirm('Want to help a fellow client to compute π?')){
                $NS$.utils.send({
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
        $NS$.utils.send({
            ___TYPE: 'action',
            ___ACTION: 'joinMontecarlo',
            ___DATA: data
        });
    };
    $NS$.handlers.DistCompConsumeResult = function (data) {
        if (data.___ID === $NS$.id){
            $NS$.handlers.DistComp.result.innerHTML = data.___DATA;
        }
    };
})();
