module.exports.launch = (action, synchazard, params) => {
    'use strict';
    const resourceFile = params.jsToObserve,
        fs = params.deps.fs,
        path = params.deps.path;

    // SETUP
    //
    action.setup({
        resourceFile: path.resolve(path.join(__dirname, '/../', resourceFile)),
        actions: {
            update: function () {
                return action.encodeMessage({
                    _ACTION: 'script',
                    _FILECHANGED: '$DATASERVER.HOST$/' + resourceFile + '?cb=' + Math.random()
                });
            }
        }
    });

    // INIT
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
        case 'init':
            ws.send(action.data.actions.update());
            break;
        }
    });

    // RUN
    //
    fs.watchFile(
        action.data.resourceFile,
        () => {
            synchazard.broadcast(action.data.actions.update());
        }
    );
};
