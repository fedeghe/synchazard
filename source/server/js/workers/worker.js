"use strict";

var actors = null;

function req(url, cb) {
    var oReq = new XMLHttpRequest();
    oReq.responseType = 'json';
    oReq.onload = function () {
        this.status == 200 && cb(this.response);
    };
    oReq.open("GET", url + "?cb=" + Math.random());
    oReq.send();
}

importScripts('actorsDontMatch.js');

self.onmessage = function (e) {

    if (actorsDontMatch(e)) return;

    if (e.data.___TYPE !== 'action') return;
    switch (e.data.___ACTION) {
        case 'xhr': 
            req(e.data.___FILECHANGED, function (cnt) {
                self.postMessage({
                    ___HANDLER: 'render',
                    ___DATA: cnt
                });
            });
            break;

        case 'json':
            self.postMessage({
                ___HANDLER: 'render2',
                ___DATA: e.data.___PAYLOAD
            });
            break;

        case 'graph':
            self.postMessage({
                ___HANDLER: 'render3',
                ___DATA: e.data.___PAYLOAD
            });
            break;

        case 'style':
            self.postMessage({
                ___HANDLER: 'render4',
                ___DATA: e.data.___FILECHANGED
            });
            break;

        case 'script':
            self.postMessage({
                ___HANDLER: 'render5',
                ___DATA: e.data.___FILECHANGED
            });
            break;

        
        default:
            self.postMessage(e.data);
            break;
    }
};