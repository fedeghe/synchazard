(function () {
    "use strict";
    var next = document.getElementById('next'),
        fib = document.getElementById('fib');
    console.log(next)
    next.addEventListener('click', function () {
        $NS$.send({___ACTION: 'next'});
    });
    $NS$.handlers.hello = function (d) {
        if (d === 'boldMe') {
            fib.style.fontWeight = 'bold';
            fib.style.color = 'red';
            return;
        } else {
            fib.style.fontWeight = '';
            fib.style.color = '';
        }
        fib.innerHTML = '';
        var e1 = document.createElement('span'),
            space = document.createElement('span'),
            e2 = document.createElement('span');
        e1.innerText = d.one;
        e2.innerText = d.two;
        space.innerText = ' - ';
        fib.appendChild(e1);
        fib.appendChild(space);
        fib.appendChild(e2);
    };
}());
