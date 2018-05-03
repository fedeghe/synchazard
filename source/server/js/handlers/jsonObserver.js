(function () {
    "use strict";
    var trg = document.getElementById('presentation');

    trg.innerHTML = '&hellip; loading';

    $NS$.handlers.render = function (d) {
        trg.innerHTML = '';
        var title = document.createElement('h2'),
            version = document.createElement('sub'),
            text = document.createElement('p'),
            a = document.createElement('a'),
            img = document.createElement('img');

        img.setAttribute('src', d.what.img);
        a.setAttribute('href', d.what.url);
        a.setAttribute('target', '_blank');
        a.appendChild(img);

        title.innerHTML = d.title;
        version.innerHTML = d.version;

        title.appendChild(version);
        trg.appendChild(title);
        trg.appendChild(a);

        text.innerHTML = 'content' in d ? d.content : 'no data';
        trg.appendChild(text);
    };
}());
