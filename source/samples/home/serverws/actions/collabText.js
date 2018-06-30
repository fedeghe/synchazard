module.exports.launch = (action, synchazard, params) => {
    "use strict";
    let nodeList = {};
    const disable = (id, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = id;
            nodeList[nodeId].value = nodeList[nodeId].value || '';
            return action.encodeMessage({
                ___ACTION: 'disableAll',
                ___VALUE: nodeList[nodeId].value,
                ___NODEID: nodeId + ""
            }, id);
        },
        enable = (id, value, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = false;
            nodeList[nodeId].value = value;
            return action.encodeMessage({
                ___ACTION: 'enableAll',
                ___VALUE: value + "",
                ___NODEID: nodeId + ""
            }, id);
        },
        getNodes = () => {
            return action.encodeMessage({
                ___ACTION: 'updateInitStatus',
                ___NODE_LIST: nodeList
            });
        },
        resize = (id, sizes, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].sizes = sizes;
            return action.encodeMessage({
                ___ACTION: 'resize',
                ___SIZES: sizes,
                ___NODEID: nodeId + ""
            }, id);
        };

    // RUN
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'init':
                synchazard.broadcast(getNodes());
                break;
            case 'disable':
                synchazard.broadcast(disable(data.___ID, data.___NODEID));
                break;
            case 'enable':
                synchazard.broadcast(enable(data.___ID, data.___VALUE, data.___NODEID));
                break;
            case 'resize':
                synchazard.broadcast(resize(data.___ID, data.___SIZES, data.___NODEID));
                break;
        }
    });
};
