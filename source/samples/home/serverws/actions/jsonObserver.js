module.exports.launch = (action, synchazard, params) => {

    "use strict";
    const resourceFile = params.jsonToObserve,
        fs = params.deps.fs,
        path = params.deps.path;

    action.setup({
        resourceFile: '/../' + resourceFile,
        host: '$DATASERVER.HOST$',
        actions: {
            update: action.encodeMessage({
                _ACTION: 'xhr',
                _FILECHANGED: '$DATASERVER.HOST$/' + resourceFile
            })
        }
    });

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.data.actions.update);
                break;
        }
    });

    // RUN
    fs.watchFile(
        path.resolve(__dirname + action.data.resourceFile),
        { interval: synchazard.WATCH_INTERVALS.SHORT },
        () => synchazard.broadcast(action.data.actions.update)
    );
};