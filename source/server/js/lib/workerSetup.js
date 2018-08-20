(function (W) {
    "use strict";

    /** include utilities */
    $$utilities.js$$

    /**
     * the constructor does not gives the full worker back,
     * or at least
     */
    var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })(),
        dataActors = currentScript.dataset.actors || null,
        $NS$ = {  
            active: true, 
            handlers: {},
            objHandlers: {},
            synchazard: new Worker(currentScript.dataset.worker),
            commands: {
                stop: stop,
                resume: resume
            },
            utils: {
                ready: (function () {
                    var cb = [],
                        readyStateCheckInterval = setInterval(function () {
                            if (document.readyState === "complete") {
                                $NS$.loaded = true;
                                clearInterval(readyStateCheckInterval);
                                for (var i = 0, l = cb.length; i < l; i++) {
                                    cb[i].call(W);
                                }
                            }
                        }, 10);
                    return function (c) {
                        if (document.readyState === "complete") {
                            c.call(W);
                        } else {
                            cb.push(c);
                        }
                    };
                })(),
                storage: Utilities.storage, 
                loadStyle: loadStyle,
                loadScript: loadScript,
                injectTester : injectTester,
                createAction: createAction,
                createInitAction: createInitAction,
                createCloseAction: createCloseAction,
                decodeFunction: decodeFunction,
                getTime : getTime,
                getQS: getQS,
                getRTT : getRTT
            }
        },
        head = document.getElementsByTagName('head')[0];

    if (!head) {
        throw new Error('NO head');
    }

    /**
     * Set a non overwritable client id, hopefully unique
     */
    Object.defineProperty($NS$, 'id', {
        value: getClientId(),
        writable: false
    });

    /**
     * set actors, even if null
     */
    $NS$.synchazard.postMessage({
        _TYPE: '_INITACTORS',
        _ACTORS: dataActors
    });

    /**
     * get queryString as obj
     */
    function getQS() {
        var search = document.location.search,
            els = search && search.substr(1).split('&'),
            i, len, tmp, out = {};
        if (els) {
            for (i = 0, len = els.length; i < len; i += 1) {
                tmp = els[i].split('=');
                out[tmp[0]] = out[tmp[0]] || W.decodeURIComponent(tmp[1]);
            }
        }
        return out;
    }

    /**
     * meant to be used to get the action rtt
     * 
     * @param {*} action 
     */
    function getRTT(action) {
        return action ? getTime() - action._TIME : null;
    }

    /** 
     * 
     * @param {*} fun 
     */
    function decodeFunction(fun) {
        return new Function('return ' + fun)();
    }

    /**
     * 
     */
    function getTime() {
        var d = new Date(),
            n = d.getTimezoneOffset();
        return +d + n * 60000;
    }
    /**
     * 
     * @param {*} action 
     */
    function createAction(action) {
        action._ACTORS = dataActors || null;
        // ensure the client identifier
        action._ID = action._ID || $NS$.id;
        // default type is action
        action._TYPE = action._TYPE || 'action';
        // given odr current
        action._TIME = action._TIME || $NS$.utils.getTime();
        // pass also always current url
        action._URL = document.location.href;
        return JSON.stringify(action);
    }

    /**
     * serialized action that can be used to ask the server
     * for initialization information, is up to us to decide how to call it.
     * the only important thing is that the socket server knows how to handle/reply to it
     * 
     * it will be sent automatically when the socket connection is established
     */
    function createInitAction () { 
        return createAction({
            _ACTION: 'init',
            _QS: getQS()
        });
    }

    /**
     * same as createInitAction but for closing
     * sent automatically on refresh or close
     */
    function createCloseAction() {
        return createAction({
            _ACTION: 'close',
            _QS: getQS()
        });
    }

    /**
     * 
     * @param {*} f 
     */
    function injectTester(f) {
        loadScript("$WEBSERVER.TESTLIB$", f);
    }

    /**
     * Get the client id, from localStorage if already stored there
     * otherwise creates and save it in the Localstorage and recall itself,
     * 
     * WARN: obviously, is is not reliable since can be overridden easily
     * 
     * @return {string} description
     */
    function getClientId() {
        var cookieName = '$NS$clientID',
            cookieValue = $NS$.utils.storage.get(cookieName);
        if (cookieValue) {
            return cookieValue;
        } else {
            $NS$.utils.storage.set(
                cookieName,
                "$NS$_" + Math.abs(~~((+new Date()) * Math.random() * 1E3))
            );
            return getClientId();
        }
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
            els = [].slice.call(document.getElementsByTagName(type), 0),
            res = els.filter(function (l) {
                return l[attr[type]].search(unCached) === 0;
            });
        return res.length ? res[0] : null;
    }

    /**
     * 
     * @param {*} tag 
     * @param {*} att 
     * @param {*} direct 
     */
    function createTag(tag, att, direct) {
        var res = document.createElement(tag),
            a;
        for (a in att) res.setAttribute(a, att[a]);
        for (a in direct) res[a] = direct[a];
        return res;
    }

    /**
     * 
     * @param {*} t 
     */
    function mayRemove(t) {
        t && t.parentNode.removeChild(t);
    }

    /**
     * 
     * @param {*} cssPath 
     * @param {*} cb 
     */
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
    
    /**
     * 
     * @param {*} jsPath 
     * @param {*} cb 
     */
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
    function stop(to) {
        $NS$.active = false;
        to && typeof to === 'number'
        && setTimeout($NS$.commands.resume, to);
    };

    /**
     * this is only available to the client obsiously 
     */
    function resume() {
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
            switch (typeof $NS$.handlers[e.data._HANDLER]) {
                case 'function':
                    $NS$.handlers[e.data._HANDLER](e.data._DATA);
                    break;
                case 'object':
                    $NS$.handlers[e.data._HANDLER].handle(e.data._DATA);
                    break;
                default: break;
            }
        }
        /**
         * in case give a small timegap
         */
        '_HANDLER' in e.data && e.data._HANDLER in $NS$.handlers ?
        r() : setTimeout(r, $WEBSERVER.TIMEGAP$);
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
    W.$NS$ = $NS$;
    W.onbeforeunload = $NS$.synchazard.terminate;
})(this);