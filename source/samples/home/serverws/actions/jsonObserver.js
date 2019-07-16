module.exports.launch = (action, synchazard, params) => {
    const resourceFile = params.jsonToObserve,
        {fs} = params.deps,
        {path} = params.deps;

    // SETUP
    //
    action.setup({
        resourceFile: `/../${resourceFile}`,
        host: `maltaV('DATASERVER.HOST')`,
        actions: {
            update: action.encodeMessage({
                _ACTION: 'xhr',
                _FILECHANGED: `maltaV('DATASERVER.HOST')/${resourceFile}`
            })
        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.data.actions.update);
                break;
            default: break;
        }
    });

    // RUN
    fs.watchFile(
        path.resolve(path.join(__dirname, action.data.resourceFile)),
        { interval: synchazard.WATCH_INTERVALS.SHORT },
        () => synchazard.broadcast(action.data.actions.update)
    );
};
