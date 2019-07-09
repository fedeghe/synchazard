// eslint-disable-next-line no-unused-vars
var actors = null;

function req(url, cb) {
    var oReq = new XMLHttpRequest();
    oReq.contentType = 'application/json';
    oReq.onload = function () {
        this.status === 200
        && cb(
            /**
             * IE sucks forever
             * ----------------
             * this is just for fucking IE, since in the xhr
             * the type has to be set lately (after open!!!!),
             * anyway the type could not be json, and anyway looks 
             * to be always a string.
             * 
             * this is a quick & dirty fix for a browser that has always been
             * and will always be a fucking nasty browser
             */
            typeof this.response === 'string'
            ? JSON.parse(this.response)
            : this.response
        );
    };
    oReq.open("GET", `${url}?cb=${Math.random()}`);
    oReq.setRequestHeader('Accept', 'application/json; charset=utf-8');
    oReq.responseType = 'json';
    oReq.send();
}

importScripts('actorsDontMatch.js');

// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {

    // eslint-disable-next-line no-undef
    if (actorsDontMatch(e)) return;

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'xhr': 
            req(e.data._FILECHANGED, function (cnt) {
                // eslint-disable-next-line no-restricted-globals
                self.postMessage({
                    _HANDLER: 'render',
                    _DATA: cnt
                });
            });
            break;

        case 'json':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'render2',
                _DATA: e.data._PAYLOAD
            });
            break;

        case 'graph':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'render3',
                _DATA: e.data._PAYLOAD
            });
            break;

        case 'style':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'render4',
                _DATA: e.data._FILECHANGED
            });
            break;

        case 'script':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'render5',
                _DATA: e.data._FILECHANGED
            });
            break;
        case 'sunshine':
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({
                _HANDLER: 'sunshine',
                _DATA: e.data._PAYLOAD
            });
            break;
        
        default:
            // eslint-disable-next-line no-restricted-globals
            self.postMessage(e.data);
            break;
    }
};