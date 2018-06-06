"use strict";

var worker = this;

function req(url, cb) {
    var oReq = new XMLHttpRequest();
    oReq.responseType = 'json';
    oReq.onload = function () {
        this.status == 200 && cb(this.response);
    };
    oReq.open("GET", url + "?cb=" + Math.random());
    oReq.send();
}

worker.onmessage = function (e) {

    $$onMessageLock.js$$

    if (e.data.___TYPE === 'action') {
        switch (e.data.___ACTION) {
            case 'xhr': 
                req(e.data.___FILECHANGED, function (cnt) {
                    worker.postMessage({
                        ___HANDLER: 'render',
                        ___DATA: cnt
                    });
                });
                break;

            case 'json':
                worker.postMessage({
                    ___HANDLER: 'render2',
                    ___DATA: e.data.___PAYLOAD
                });
                break;

            case 'graph':
                worker.postMessage({
                    ___HANDLER: 'render3',
                    ___DATA: e.data.___PAYLOAD
                });
                break;

            case 'style':
                worker.postMessage({
                    ___HANDLER: 'render4',
                    ___DATA: e.data.___FILECHANGED
                });
                break;

            case 'script':
                worker.postMessage({
                    ___HANDLER: 'render5',
                    ___DATA: e.data.___FILECHANGED
                });
                break;

            
            default:
                worker.postMessage(e.data);
                break;
        }
    }
};