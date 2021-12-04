(function () {
    

    var trg = document.querySelector('.presentation');

    trg.innerHTML = '<div class="loader"></div>';

    // eslint-disable-next-line no-undef
    maltaV('NS').handlers.render = function (d) {
        var title = document.createElement('h2'),
            version = document.createElement('sub'),
            text = document.createElement('p'),
            a = document.createElement('a'),
            img = document.createElement('img');
        trg.innerHTML = '';

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
