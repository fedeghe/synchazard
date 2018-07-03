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

    if (e.data._TYPE !== 'action') return;
    switch (e.data._ACTION) {
        case 'xhr': 
            req(e.data._FILECHANGED, function (cnt) {
                self.postMessage({
                    _HANDLER: 'render',
                    _DATA: cnt
                });
            });
            break;

        case 'json':
            self.postMessage({
                _HANDLER: 'render2',
                _DATA: e.data._PAYLOAD
            });
            break;

        case 'graph':
            self.postMessage({
                _HANDLER: 'render3',
                _DATA: e.data._PAYLOAD
            });
            break;

        case 'style':
            self.postMessage({
                _HANDLER: 'render4',
                _DATA: e.data._FILECHANGED
            });
            break;

        case 'script':
            self.postMessage({
                _HANDLER: 'render5',
                _DATA: e.data._FILECHANGED
            });
            break;

        
        default:
            self.postMessage(e.data);
            break;
    }
};