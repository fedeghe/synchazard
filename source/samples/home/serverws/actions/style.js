const fs = require('fs'),
    path = require('path');

module.exports.launch = (action, synchazard, params) => {
    
    const resourceFile = params.cssToObserve;

    // SETUP
    //
    action.setup({
        resourceFile: path.resolve(path.join(__dirname, '/../', resourceFile)),
        actions: {
            update: function () {
                return action.encode({
                    _ACTION: 'style',
                    _FILECHANGED: `maltaV('DATASERVER.HOST')/${resourceFile}?cb=${Math.random()}`
                });
            }
        }
    });

    // INIT
    //
    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.data.actions.update());
                break;
            default: break;
        }
    }).start();

    // RUN
    //
    fs.watchFile(
        action.data.resourceFile,
        {
            interval: synchazard.WATCH_INTERVALS.SHORT
        },
        () => {
            synchazard.broadcast(action.data.actions.update());
        }
    );
};
