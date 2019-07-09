(function () {
    var next = document.getElementById('next'),
        fib = document.getElementById('fib'),
        t;
    next.addEventListener('click', function () {
        maltaV('NS').send({_ACTION: 'next'});
    });
    maltaV('NS').handlers.hello = function (d) {
        if (d === 'boldMe') {
            fib.style.fontWeight = 'bold';
            fib.style.color = 'red';
            return;
        } 
            fib.style.fontWeight = '';
            fib.style.color = '';
        
        fib.innerHTML = '';
        var e1 = document.createElement('span'),
            space = document.createElement('span'),
            e2 = document.createElement('span'),
            t = document.createElement('p'),
            data = d._PAYLOAD,
            time = d._TIME;
        e1.innerText = data.one;
        e2.innerText = data.two;
        t.innerText = `rtt: ${maltaV('NS').utils.getTime() - time}`;
        space.innerText = ' - ';
        fib.appendChild(e1);
        fib.appendChild(space);
        fib.appendChild(e2);
        fib.appendChild(t);
    };
}());
