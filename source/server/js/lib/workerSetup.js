(function () {
    "use strict";
    /**
     * the constructor does not gives the full worker back,
     * or at least
     */
    var $NS$ = {
            commands: {},
            handlers: {},
            objHandlers: {},
            utils: {
                loadStyle: loadStyle,
                loadScript: loadScript,
                injectTester : function (f) {
                    loadScript("$SERVER.TESTLIB$", f);
                },
                createAction: function (o) {
                    return JSON.stringify(o);
                },
                decodeFunction: function(fun){
                    return new Function('return ' + fun)();
                }
            },
            dataWorker: new Worker(document.currentScript.dataset.worker),
            id: getClientID(),
            active: true
        },
        head = document.getElementsByTagName('head')[0];
    
    function getClientID() {
        var cookieName = '$NS$clientID',
            cookieValue = localStorage.getItem(cookieName);
        if (cookieValue) {
            return cookieValue;
        } else {
            localStorage.setItem(
                cookieName,
                "$NS$_" + Math.abs(~~((+new Date()) * Math.random() * 1E3))
            );
            return getClientID();
        }
    }
    if (!head) {
        throw new Error('NO head');
    }

    /**
     * function to get url passed without cachebuster
     * 
     * @param {*} p 
     * @param {*} type 
     */
    function getCleanPath(p, type) {
        var unCached = p.split('?')[0],
            attr = {css: 'href', js: 'src'},
            els = [].slice.call(document.getElementsByTagName(type), 0);
        return els.find(function (l) {
            return l[attr[type]].search(unCached) === 0;
        });
    }
    function createTag(tag, att, direct) {
        var res = document.createElement(tag),
            a;
        for (a in att) res.setAttribute(a, att[a]);
        for (a in direct) res[a] = direct[a];
        return res;
    }

    function mayRemove(t) {
        t && t.parentNode.removeChild(t);
    }

    function loadStyle(cssPath, cb) {
        var link = getCleanPath(cssPath, 'css');
        mayRemove(link);
        link = createTag('link', {
            rel : 'stylesheet',
            type: 'text/css',
            href : cssPath
        }, {onload : cb});
        head.appendChild(link);
    }
    
    function loadScript(jsPath, cb) {
        var script = getCleanPath(jsPath, 'js');
        mayRemove(script);
        script = createTag('script', {
            type: 'text/javascript',
            src: jsPath
        }, {onload: cb});
        head.appendChild(script);
    }

    
    /**
     * 
     */
    $NS$.commands.stop = function (to) {
        $NS$.active = false;
        to &&
        typeof to === 'number' &&
        setTimeout($NS$.commands.resume, to);
    };

    /**
     * this is only available to the client obsiously 
     */
    $NS$.commands.resume = function () {
        $NS$.active = true;
    };

    /**
     * When the worker receives a message (always from the socketcli)
     * 
     * just check that has a HANDLER function that can be accessed globally
     * 
     * if the function is found forward to it the
     * DATA 
     */
    $NS$.dataWorker.onmessage = function (e) {
        //=================================================
        function r() {
            switch (typeof $NS$.handlers[e.data.___HANDLER]) {
                case 'function':
                    $NS$.handlers[e.data.___HANDLER](e.data.___DATA);
                    break;
                case 'object':
                    $NS$.handlers[e.data.___HANDLER].handle(e.data.___DATA);
                    break;
                default: break;
            }
        }
        /**
         * in case give a small timegap
         */
        '___HANDLER' in e.data && e.data.___HANDLER in $NS$.handlers ?
        r() : setTimeout(r, $SERVER.TIMEGAP$);
    };

    /**
     * in case a error occurs just shut the worker down 
     */
    $NS$.dataWorker.onerror = function (e) {
        console.log(e);
        $NS$.dataWorker.terminate();
    };

    /**
     * the worker is used inside the socketCli in the onMessage
     * the easyiest option is to publish it
     */
    window.$NS$ = $NS$;
    window.onbeforeunload = $NS$.dataWorker.terminate;
})();