module.exports.launch = (action, socketSrv, params) => {
    
    "use strict";

    const resourceFile = params.cssToObserve,
        fs = params.deps.fs,
        path = params.deps.path;
    
    // SETUP
    //
    action.setup({
        resourceFile: path.resolve(__dirname + '/../' + resourceFile),
        actions: {
            update: function () {
                return action.encodeMessage({
                    ___ACTION: 'style',
                    ___FILECHANGED: '$DATASERVER.HOST$/' + resourceFile + '?cb=' + Math.random()
                });
            }
        }
    });

    // INIT
    //
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'init':
                ws.send(action.data.actions.update());
                break;
        }
    });

    // RUN
    //
    fs.watchFile(
        action.data.resourceFile,
        {
            interval: $DATASERVER.WATCH_INTERVALS.SHORT$
        },
        () => {
            socketSrv.broadcast(action.data.actions.update());
        }
    );
};