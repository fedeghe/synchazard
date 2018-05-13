module.exports.launch = (action, socketSrv, params) => {
    
    "use strict";

    const resourceFile = params.cssToObserve;

    action.setup({
        resourceFile: params.deps.path.resolve(__dirname + '/../' + resourceFile),
        actions: {
            update: function () {
                return action.encodeMessage({
                    ___TYPE: 'style',
                    ___FILECHANGED: '$DATASERVER.HOST$/' + resourceFile + '?cb=' + Math.random()
                });
            }
        }
    });

    action.onconnection((data, ws) => {
        if (data.___TYPE === 'action') {
            action.notify(__filename, data);
            switch (data.___ACTION) {
                case 'init':
                    ws.send(action.data.actions.update());
                    break;
            }
        }
    });

    // RUN
    params.deps.fs.watchFile(
        action.data.resourceFile,
        () => {
            socketSrv.broadcast(action.data.actions.update());
        }
    );
};