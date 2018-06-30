module.exports.launch = (action, synchazard, params) => {

    "use strict";

    const resourceFile = params.jsToObserve,
        fs = params.deps.fs,
        path = params.deps.path;

    // SETUP
    //
    action.setup({
        resourceFile: path.resolve(__dirname + '/../' + resourceFile),
        actions: {
            update: function () {
                return action.encodeMessage({
                    ___ACTION: 'script',
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
        () => {
            synchazard.broadcast(action.data.actions.update());
        }
    );
};