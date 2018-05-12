require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    
    /** At least check for memory leaks **/
    memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
});

const socketsSrv = require('./core/socketSrv'),
    actions = [
        {
            path: 'actions/jsonObserver',
            deps: { fs: fs, path: path },
        }
        , {
            path: 'actions/style',
            deps: { fs: fs, path: path },
            cssToObserve: 'css/sync_style.css'
        }
        , {
            path: 'actions/script',
            deps: {fs: fs, path: path},
            jsToObserve: 'js/sync_script.js'
        }
        , { path: 'actions/incremental' }
        , { path: 'actions/randomPercentage' }
        , { path: 'actions/reactor' }
        , { path: 'actions/react' }
        , { path: 'actions/chat' }
        , { path: 'actions/montecarlo' }
        , { path: 'actions/doJob' }
        , { path: 'actions/collabText' }
        , { path: 'actions/chess' }
    ];
/**
 * launch all actions passing if found other parameters to activate debug
 */
socketsSrv.launch(actions, process.argv.slice(2));