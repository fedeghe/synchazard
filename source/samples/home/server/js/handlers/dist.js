(function () {

    maltaF('../utils.js')

    function DC() { }

    DC.prototype.set = function (buttonID, resultID, messageID) {
        this.button = document.getElementById(buttonID);
        this.result = document.getElementById(resultID);
        this.message = document.getElementById(messageID);
        this.button.addEventListener('click', function () {
            maltaV('NS').send({
                _ACTION: 'askMontecarlo'
            });
        });
    };

    DC.prototype.handle = function (data) {
        switch(data._ACTION) {
            case 'requestRandomPairs':
                // eslint-disable-next-line no-restricted-globals, no-alert
                if (confirm('Want to help a fellow client to compute π?')) {
                    maltaV('NS').send({
                        _ACTION: 'acceptedMontecarlo'
                    });
                } else {
                    maltaV('NS').send({
                        _ACTION: 'rejectedMontecarlo'
                    });
                    // eslint-disable-next-line no-alert
                    maltaV('NS').handlers.DistComp.message.innerHTML = 'Got it!... thanks anyway!';
                }
                break;
            case 'updatedComputation':
                consumeResult(data);
                break;
            case 'thx':
                console.log(data._MSG);
                break;
            case 'noClients':
                // eslint-disable-next-line no-alert
                // alert('Ups ... !\nLooks like there are no other clients on this page that could help You... try later!\nor open one or more of the same page elsewhere');
                maltaV('NS').handlers.DistComp.button.disabled = true;
                maltaV('NS').handlers.DistComp.message.innerHTML = '... no clients connected';
                break;
            case 'busy': 
                maltaV('NS').handlers.DistComp.button.disabled = true;
                maltaV('NS').handlers.DistComp.button.title = '... ongoing collaborative calculation...be patient';
                maltaV('NS').handlers.DistComp.message.innerHTML = '... ongoing!';
                break;
            case 'free': 
                maltaV('NS').handlers.DistComp.button.disabled = false;
                maltaV('NS').handlers.DistComp.button.title = 'trigger it!';
                maltaV('NS').handlers.DistComp.message.innerHTML = 'ready!';

                break;
            default: break;
        }
    };

    maltaV('NS').handlers.DistComp = new DC();

    maltaV('NS').handlers.DistCompSendResult = function (data) {
        maltaV('NS').send({
            _ACTION: 'joinMontecarlo',
            _DATA: data
        });
    };

    function consumeResult(data) {
        /**
         * here we filter the message on the client,
         * if the local cli id is not the one given by the server (the original requesting client id)
         * 
         * if we set to false the all flag  only the asking client will display the result
         */
        // eslint-disable-next-line vars-on-top
        var all = true,
            result,
            distance,
            using,
            previousPI = data._PREVIOUS,
            newPI = data._DATA,
            err = data._ERR,
            stats = data._STATS,
            // eslint-disable-next-line no-undef
            what = whatChanged(previousPI, newPI);
        if (all || data._ID === maltaV('NS').id) {
            result = document.createElement('p');
            distance = document.createElement('p');
            using = document.createElement('p');
            result.innerHTML = `<span class="pi">&pi;</span> &asymp; <span class="stable">${what.stable}</span><span class="unstable">${what.unstable}</span>`;
            distance.innerHTML = `err (against Math.PI): ${err}%`;
            // eslint-disable-next-line no-undef
            using.innerHTML = `<span class="small">using ${prefixNumber(stats.inside + stats.outside)} shooting</span class="small">`;
            maltaV('NS').handlers.DistComp.result.innerHTML = '';
            maltaV('NS').handlers.DistComp.result.appendChild(result);
            maltaV('NS').handlers.DistComp.result.appendChild(distance);
            maltaV('NS').handlers.DistComp.result.appendChild(using);
        }
    }
})();
