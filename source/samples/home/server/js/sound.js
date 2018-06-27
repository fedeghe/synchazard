(function (){
    "use strict"; 

    function synth (mods, duration, min, max, mode) {
        "use strict";
        min = min || 80;
        max = max || 1120;
        window.a_context = window.a_context || new (window.AudioContext || window.webkitAudioContext)();
        var period = duration / mods,
            oscillator = a_context.createOscillator(),
            freqFactory = {
                index: 0,
                next: function () {
                    this.index++;
                    return ~~(Math.random() * (max - min) + min); //[20, 10K] Hz
                },
                gotNext: function () {
                    return this.index < mods;
                }
            };

        oscillator.type = mode || 'sine'; //'square', 'triangle'
        oscillator.connect(a_context.destination);

        console.log('Period: ' + period)
        console.log('Type: ' + oscillator.type)

        // ensure stop on small periods
        setTimeout(function () {
            freqFactory.index = mods;
        }, duration);

        oscillator.start();
        (function play() {
            var freq = freqFactory.next();
            oscillator.frequency.value = freq;
            console.log('#' + freqFactory.index + ': ' + freq + ' Hz');
            setTimeout(function () {
                if (freqFactory.gotNext()) {
                    play();
                } else {
                    oscillator.stop(0);
                }
            }, period);
        })();
    }

    window.synth = synth;
})();
