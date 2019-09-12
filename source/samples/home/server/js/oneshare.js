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
    function doRender() {
        this.target.appendChild(this.main)
    }

    maltaF('oneShare/injector.js');
    maltaF('oneShare/ShareArea.js');
    maltaF('oneShare/SharedArea.js');
    maltaF('oneShare/FilePoolSelect.js');
    maltaF('oneShare/Modeler.js');
    

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    window.addEventListener('load', function () {
        var target = document.getElementById('target'),
            shareArea = new ShareArea(target),
            hr = createElement('div', {'class': 'hr'}),
            sharedArea = new SharedArea(target);
        shareArea.render();
        target.appendChild(hr)
        sharedArea.render();

        window.oneShare = {
            shareArea,
            sharedArea
        }
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
