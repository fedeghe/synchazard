require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    // eslint-disable-next-line import/no-unresolved
    synchazard = require('./core/synchazard'),
    // get args if any
    argz = process.argv.slice(2);

/*
    check for memory leaks
    memwatch = require('memwatch-next'),
    memwatch.on('leak', (info) => {
        console.error('Memory leak detected:\n', info);
    });
*/

/**
 * launch all actions passing if found other parameters to activate debug
 */
synchazard.launch([{
    path: 'actions/jsonObserver',
    jsonToObserve: './data1.json',
    actor: 'jsonObserver'
}, {
    path: 'actions/style',
    cssToObserve: 'css/sync_style.css',
    actor: 'style'
}, {
    path: 'actions/script',
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
    path: 'actions/test',
    actor: 'script'
}, { 
    path: 'actions/oneshare',
    actor: 'oneshare'
}
// , {
//    path: 'actions/sunshine'
// }
], argz);
