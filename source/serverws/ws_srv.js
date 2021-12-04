/* eslint-disable no-unused-vars */
require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    socketsSrv = require('./core/synchazard'),
    
    // check for memory leaks
    // memwatch = require('memwatch-next'),

    // get args if any
    argz = process.argv.slice(2);

// memwatch.on('leak', (info) => {
//     console.error('Memory leak detected:\n', info);
// });

/**
 * launch all actions passing if found other parameters to activate debug
 */
// socketsSrv.launch([{
//     path: 'actions/test',
//     deps: { fs: fs, path: path },
//     actor: 'test'
// }], argz);