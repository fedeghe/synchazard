(function () {
    var trg = document.getElementById('number');
    function render2(d) {
        trg.innerHTML = d.num;
    }
    maltaV('NS').handlers.render2 = render2;
}());
