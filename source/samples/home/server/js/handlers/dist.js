(function () {
    function DC() { }

    DC.prototype.set = function (buttonID, resultID) {
        this.button = document.getElementById(buttonID);
        this.result = document.getElementById(resultID);
        this.button.addEventListener('click', function () {
            maltaV('NS').send({
                _ACTION: 'askMontecarlo'
            });
        });
    };

    DC.prototype.handle = function (d) {
        if (maltaV('NS').id !== d._ID) {

            // eslint-disable-next-line no-restricted-globals, no-alert
            if (confirm('Want to help a fellow client to compute π?')) {
                maltaV('NS').send({
                    _ACTION: 'acceptedMontecarlo'
                });
            } else {
                // eslint-disable-next-line no-alert
                alert('Got it!... thanks anyway!');
            }
        }
    };

    maltaV('NS').handlers.DistComp = new DC();

    maltaV('NS').handlers.DistCompNoClients = function (/* data */) {
        // eslint-disable-next-line no-alert
        alert('Ups ... !\nLooks like there are no other clients on this page that could help You... try later!\nor open one or more of the same page elsewhere');
    };
    maltaV('NS').handlers.DistCompSendResult = function (data) {
        maltaV('NS').send({
            _ACTION: 'joinMontecarlo',
            _DATA: data
        });
    };
    maltaV('NS').handlers.DistCompSayThx = function (data) {
        console.log(data._MSG);
    };
    maltaV('NS').handlers.DistCompConsumeResult = function (data) {
        /**
         * here we filter the message on the client,
         * if the local cli id is not the one given by the server (the original requesting client id)
         * 
         * if we set to false the all flag  only the asking client will display the result
         */
        var all = true,
            result,
            distance;
        if (all || data._ID === maltaV('NS').id) {
            result = document.createElement('p');
            distance = document.createElement('p');
            result.innerHTML = `<span class="pi">&pi;</span> &asymp; ${data._DATA}`;
            distance.innerHTML = `err (agains Math.PI): ${(100 * (Math.PI - parseFloat(data._DATA, 10)) / Math.PI).toFixed(7)}%`
            maltaV('NS').handlers.DistComp.result.innerHTML = '';
            maltaV('NS').handlers.DistComp.result.appendChild(result);
            maltaV('NS').handlers.DistComp.result.appendChild(distance);
        }
    };
})();
