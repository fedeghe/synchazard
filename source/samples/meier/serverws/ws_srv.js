require('events').EventEmitter.defaultMaxListeners = Infinity;

const fs = require('fs'),
    path = require('path'),
    // eslint-disable-next-line import/no-unresolved
    synchazard = require('./core/synchazard'),
    // get args if any
    argz = process.argv.slice(2);


/**
 * launch all actions passing if found other parameters to activate debug
 */
synchazard.launch([{
    path: 'actions/meier',
    deps: { fs: fs, path: path },
    actor: 'meier'
}], argz);