module.exports.launch = (action, socketSrv, params) => {

    "use strict";

    const resourceFile = 'data1.json',
        fs = params.deps.fs,
        path = params.deps.path;

    action.setup({
        resourceFile: '/../' + resourceFile,
        host: '$DATASERVER.HOST$',
        actions: {
            update: action.encodeMessage({
                ___ACTION: 'xhr',
                ___FILECHANGED: '$DATASERVER.HOST$/' + resourceFile
            })
        }
    });

    action.onconnection((data, ws) => {
        if (data.___TYPE === 'action') {
            action.notify(__filename, data);
            switch (data.___ACTION) {
                case 'init':
                    ws.send(action.data.actions.update);
                    break;
            }
        }
    });

    // RUN
    fs.watchFile(
        path.resolve(__dirname + action.data.resourceFile),
        () => {
            socketSrv.broadcast(action.data.actions.update);
        }
    );
};