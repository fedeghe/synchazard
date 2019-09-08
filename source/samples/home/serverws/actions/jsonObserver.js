const fs = require('fs'),
    path = require('path');

module.exports.launch = (action, synchazard, params) => {
    const resourceFile = params.jsonToObserve;

    // SETUP
    //
    action.setup({
        resourceFile: `/../${resourceFile}`,
        host: `maltaV('DATASERVER.HOST')`,
        actions: {
            update: action.encode({
                _ACTION: 'xhr',
                _FILECHANGED: `maltaV('DATASERVER.HOST')/${resourceFile}`
            })
        }
    });

    // CONNECTION
    //
    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.data.actions.update);
                break;
            default: break;
        }
    }).start();

    // RUN
    fs.watchFile(
        path.resolve(path.join(__dirname, action.data.resourceFile)),
        { interval: synchazard.WATCH_INTERVALS.SHORT },
        () => synchazard.broadcast(action.data.actions.update)
    );
};
