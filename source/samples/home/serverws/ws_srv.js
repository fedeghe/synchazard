require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    socketsSrv = require('./core/socketSrv'),
    
    // check for memory leaks
    memwatch = require('memwatch-next'),

    // get args if any
    argz = process.argv.slice(2);

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
});

/**
 * launch all actions passing if found other parameters to activate debug
 */
socketsSrv.launch([{
    path: 'actions/jsonObserver',
    deps: { fs: fs, path: path },
    actor: 'jsonObserver'
}, {
    path: 'actions/style',
    deps: { fs: fs, path: path },
    cssToObserve: 'css/sync_style.css',
    actor: 'style'
}, {
    path: 'actions/script',
    deps: { fs: fs, path: path },
    jsToObserve: 'js/sync_script.js',
    actor: 'script'
}, {
    path: 'actions/incremental',
    actor: 'incremental'
}, {
    path: 'actions/randomPercentage',
    actor: 'randomPercentage'
}, {
    path: 'actions/reactor',
    actor: 'reactor'
}, {
    path: 'actions/react',
    actor: 'react'
}, {
    path: 'actions/chat',
    actor: 'chat'
}, {
    path: 'actions/montecarlo',
    actor: 'montecarlo'
}, {
    path: 'actions/doJob',
    actor: 'doJob'
}, {
    path: 'actions/collabText',
    actor: 'collabText'
}, {
    path: 'actions/test'
}], argz);