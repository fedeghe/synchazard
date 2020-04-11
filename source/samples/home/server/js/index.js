/**
 *
 */
(function () {
    

    var head = document.getElementsByTagName('head')[0],
        // eslint-disable-next-line prefer-destructuring
        body = document.body,
        header = createNode({ tag: 'header', cls: 'group' }),
        watch = createNode({ tag: 'span', attrs: { id: 'watch' } }),
        samples = createNode({ tag: 'a', cls: 'samples', attrs: { href: '/samples.html' }, html: 'samples' }),
        pres = createNode({ cls: 'presentation' }),
        graph = createNode({ cls: 'graph' });

    header.appendChild(watch);
    header.appendChild(samples);
    body.appendChild(header);
    body.appendChild(pres);
    body.appendChild(graph);
    createWatch(watch);

    maltaV('NS').utils.loadScript('/js/handlers/jsonObserver.js');
    maltaV('NS').utils.loadScript('/js/handlers/randomPercentage.js', remove);
    maltaV('NS').utils.loadScript('/js/handlers/style.js', remove);
    maltaV('NS').utils.loadScript('/js/handlers/script.js', remove);
    maltaV('NS').utils.loadScript('/js/handlers/sunshine.js', remove);
    maltaV('NS').utils.loadScript('/js/handlers/oneshare.js', remove);

    function remove () {
        head.removeChild(this);
    }
    function createNode (pars) {
        var tag = document.createElement(pars.tag || 'div'),
            i;
        if (pars.attrs) {
            for (i in pars.attrs) {
                if (pars.attrs.hasOwnProperty(i)) {
                    tag.setAttribute(i, pars.attrs[i]);
                }
            }
        }
        if (pars.cls) { tag.className = pars.cls; }
        if (pars.html) { tag.innerHTML = pars.html; }
        return tag;
    }
    function createWatch (node) {
        function p2 (d) {
            return d > 9 ? d : '0' + d;
        }
        function format (d) {
            return [p2(d.getDate()), p2(d.getMonth() + 1), d.getFullYear()].join('-') 
                +' @ ' + 
                [p2(d.getHours()), p2(d.getMinutes()), p2(d.getSeconds())].join(':');
        }
        function t () {
            node.innerHTML = format(new Date());
        }
        t();
        setInterval(t, 1000);
    }

    window.addEventListener('scroll', function (e) {
        console.log(e)
    }, false)


})();
