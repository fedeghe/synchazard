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
        { path: 'actions/chess' }
    ];
/**
 * launch all actions passing if found other parameters to activate debug
 */
socketsSrv.launch(actions, process.argv.slice(2));