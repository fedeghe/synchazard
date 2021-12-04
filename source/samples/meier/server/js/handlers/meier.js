(function () {
    

    // var next = document.getElementById('next'),
    //     fib = document.getElementById('fib'),
    //     t;
    // next.addEventListener('click', function () {
    //     maltaV('NS').send({_ACTION: 'next'});
    // });
    maltaV('NS').handlers.init = function (d) {
        console.log('init')
        console.log(d)
    };
}());
