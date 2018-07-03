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
                _ACTION: 'reactor_disableAll',
                _VALUE: nodeList[nodeId].value,
                _NODEID: nodeId + ""
            }, { id : id });
        },
        enable = (id, val, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = false;
            nodeList[nodeId].value = val;
            return action.encodeMessage({
                _ACTION: 'reactor_enableAll',
                _VALUE: val + "",
                _NODEID: nodeId + ""
            }, { id : id });
        },
        getNodeList = () => {
            return action.encodeMessage({
                _ACTION: 'reactor_updateInitStatus',
                _NODE_LIST: nodeList
            });
        };
    
    // RUN
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        var action = null;
        switch (data._ACTION) {
            case 'init':
                action = getNodeList();
                break;
            case 'disable':
                action = disable(data._ID, data._NODEID);
                break;
            case 'enable':
                action = enable(data._ID, data._VALUE, data._NODEID);
                break;
        }
        action && synchazard.broadcast(action);
    });
};
