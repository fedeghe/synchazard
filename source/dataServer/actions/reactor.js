module.exports.launch = (action, socketSrv, params) => {

    "use strict";

    let nodeList = {};

    const disable = (id, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = id;
            nodeList[nodeId].value = nodeList[nodeId].value || '';
            return action.encodeMessage({
                ___ACTION: 'reactor_disableAll',
                ___VALUE: nodeList[nodeId].value,
                ___NODEID: nodeId + ""
            }, id);
        },
        enable = (id, val, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = false;
            nodeList[nodeId].value = val;
            return action.encodeMessage({
                ___ACTION: 'reactor_enableAll',
                ___VALUE: val + "",
                ___NODEID: nodeId + ""
            }, id);
        },
        getNodeList = () => {
            return action.encodeMessage({
                ___ACTION: 'reactor_updateInitStatus',
                ___NODE_LIST: nodeList
            });
        };
    
    // RUN
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        var action = null;
        switch (data.___ACTION) {
            case 'init':
                action = getNodeList());
                break;
            case 'disable':
                action = disable(data.___ID, data.___NODEID);
                break;
            case 'enable':
                action = enable(data.___ID, data.___VALUE, data.___NODEID);
                break;
        }
        action && socketSrv.broadcast(action);
    });
};
