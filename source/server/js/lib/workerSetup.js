(function () {
    "use strict";
    /**
     * the constructor does not gives the full worker back,
     * or at least
     */
    var currentScript = document.currentScript,
        dataActors = currentScript.dataset.actors || null,
        $NS$ = {
            commands: {},
            handlers: {},
            objHandlers: {},
            synchazard: new Worker(currentScript.dataset.worker),
            utils: {
                loadStyle: loadStyle,
                loadScript: loadScript,
                injectTester : function (f) {
                    loadScript("$SERVER.TESTLIB$", f);
                },
                createAction: function (action) {
                    action.___ACTORS = dataActors || null;
                    return JSON.stringify(action);
                },
                decodeFunction: function(fun){
                    return new Function('return ' + fun)();
                },
                getTime : function () {
                    var d = new Date(),
                        n = d.getTimezoneOffset();
                    return +d + n * 60000;
                },
                getRTT : function (action) {
                    return action ? $NS$.utils.getTime() - action.___TIME : null;
                }
            },
            active: true
        },
        head = document.getElementsByTagName('head')[0];

    /**
     * set a non overwritable client id, hopefully unique
     */
    Object.defineProperty($NS$, 'id', {
        value: getClientId(),
        writable: false
    });

    // set actors, even if null
    $NS$.synchazard.postMessage({
        ___TYPE: '___INITACTORS',
        ___ACTORS: dataActors
    });

    function getClientId() {
        var cookieName = '$NS$clientID',
            cookieValue = localStorage.getItem(cookieName);
        if (cookieValue) {
            return cookieValue;
        } else {
            localStorage.setItem(
                cookieName,
                "$NS$_" + Math.abs(~~((+new Date()) * Math.random() * 1E3))
            );
            return getClientId();
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
    $NS$.synchazard.onmessage = function (e) {
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
    $NS$.synchazard.onerror = function (e) {
        console.log(e);
        $NS$.synchazard.terminate();
    };

    /**
     * the worker is used inside the socketCli in the onMessage
     * the easyiest option is to publish it
     */
    window.$NS$ = $NS$;
    window.onbeforeunload = $NS$.synchazard.terminate;
})();