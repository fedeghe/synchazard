/**
 *
 */
(function () {
    function createElement(tag, attrs, html) {
        var t = document.createElement(tag),
            i;
        for (i in attrs) {
            if (attrs.hasOwnProperty(i)) {
                t.setAttribute(i, attrs[i])
            }
        }
        html && (t.innerHTML = html);
        return t;
    }
    // eslint-disable-next-line no-unused-vars
    function doRender() {
        this.target.appendChild(this.main)
    }

    maltaF('../oneShare/injector.js');
    maltaF('../oneShare/ShareArea.js');
    maltaF('../oneShare/SharedArea.js');
    maltaF('../oneShare/FilePoolSelect.js');
    maltaF('../oneShare/Modeler.js');

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        // eslint-disable-next-line no-alert
        alert('The File APIs are not fully supported in this browser.');
    }
    window.addEventListener('load', function () {
        var target = document.getElementById('target'),
            // eslint-disable-next-line no-undef
            shareArea = new ShareArea(target),
            hr = createElement('div', {'class': 'hr'}),
            // eslint-disable-next-line no-undef
            sharedArea = new SharedArea(target);

        shareArea.render();
        target.appendChild(hr)
        sharedArea.render();

        window.oneShare = {
            shareArea: shareArea,
            sharedArea: sharedArea
        };
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
