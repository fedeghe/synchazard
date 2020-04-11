window.addEventListener('load', function () {
    var o = 0,
        duration = 1,
        steps = 30,
        step = duration / steps;
    // document.body.style.opacity = 0;
    function doStep () {
        o += step;
        document.body.style.opacity = o;
        if (o < 1) window.requestAnimationFrame(doStep)
    }
    document.body.style.opacity == 0 && window.requestAnimationFrame(doStep)
})