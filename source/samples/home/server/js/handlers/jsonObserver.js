(function () {
    "use strict";
    var trg = document.querySelector('.presentation');

    trg.innerHTML = '&hellip; loading';

    $NS$.handlers.render = function (d) {
        
        /**
         * this is just for fucking IE, since in the xhr
         * the type has to be set latel (after open!!!!),
         * so the type could not be json
         * 
         * this is a quick & dirty fix
         */
        d = typeof d == 'object' ? d : JSON.parse(d); 
        /**
         * end of the quick & dirty
         */

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
