(function (W) {
    "use strict";
    /**
     * the constructor does not gives the full worker back,
     * or at least
     */
    var currentScript = document.currentScript,
        dataActors = currentScript.dataset.actors || null,
        $NS$ = {   
            handlers: {},
            objHandlers: {},
            synchazard: new Worker(currentScript.dataset.worker),
            commands: {
                stop: stop,
                resume: resume
            },
            utils: {
                loadStyle: loadStyle,
                loadScript: loadScript,
                injectTester : injectTester,
                createAction: createAction,
                decodeFunction: decodeFunction,
                getTime : getTime,
                getRTT : getRTT
            },
            active: true
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
        action._TYPE = action._TYPE || 'action';
        action._TIME = action._TIME || $NS$.utils.getTime();
        return JSON.stringify(action);
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
        to &&
            typeof to === 'number' &&
            setTimeout($NS$.commands.resume, to);
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