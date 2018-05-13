require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    socketsSrv = require('./core/socketSrv'),
    
    /** At least check for memory leaks **/
    memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
});

/**
 * launch all actions passing if found other parameters to activate debug
 */
socketsSrv.launch([{
    path: 'actions/jsonObserver',
    deps: { fs: fs, path: path },
    actors: 'jsonObserver'
}, {
    path: 'actions/style',
    deps: { fs: fs, path: path },
    cssToObserve: 'css/sync_style.css',
    actors: 'style'
}, {
    path: 'actions/script',
    deps: { fs: fs, path: path },
    jsToObserve: 'js/sync_script.js',
    actors: 'script'
}, {
    path: 'actions/incremental',
    actors: 'incremental'
}, {
    path: 'actions/randomPercentage',
    actors: 'randomPercentage'
}, {
    path: 'actions/reactor',
    actors: 'reactor'
}, {
    path: 'actions/react',
    actors: 'react'
}, {
    path: 'actions/chat',
    actors: 'chat'
}, {
    path: 'actions/montecarlo',
    actors: 'montecarlo'
}, {
    path: 'actions/doJob',
    actors: 'doJob'
}, {
    path: 'actions/collabText',
    actors: 'collabText'
}, {
    path: 'actions/chess',
    actors: 'chess'
}], process.argv.slice(2));