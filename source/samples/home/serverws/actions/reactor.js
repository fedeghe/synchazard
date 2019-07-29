module.exports.launch = (action, synchazard/* , params */) => {
    const nodeList = {},
        actions = {
            disable : (id, nodeId) => {
                nodeList[nodeId] = nodeList[nodeId] || {};
                nodeList[nodeId].clients = nodeList[nodeId].clients || [];
                nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
                nodeList[nodeId].gotToken = id;
                nodeList[nodeId].value = nodeList[nodeId].value || '';
                return action.encode({
                    _ACTION: 'reactor_disableAll',
                    _VALUE: nodeList[nodeId].value,
                    _NODEID: `${nodeId  }`
                }, { id: id });
            },
            enable : (id, val, nodeId) => {
                nodeList[nodeId] = nodeList[nodeId] || {};
                nodeList[nodeId].clients = nodeList[nodeId].clients || [];
                nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
                nodeList[nodeId].gotToken = false;
                nodeList[nodeId].value = val;
                return action.encode({
                    _ACTION: 'reactor_enableAll',
                    _VALUE: `${val  }`,
                    _NODEID: `${nodeId  }`
                }, { id: id });
            },
            getNodeList : () => {
                return action.encode({
                    _ACTION: 'reactor_updateInitStatus',
                    _NODE_LIST: nodeList
                });
            }
        };

    // CONNECTION
    //
    action.onconnection((data/* , ws */) => {
        var response = null;
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                response = actions.getNodeList();
                break;
            case 'disable':
                response = actions.disable(data._ID, data._NODEID);
                break;
            case 'enable':
                response = actions.enable(data._ID, data._VALUE, data._NODEID);
                break;
            default:break;
        }
        response && synchazard.broadcast(response);
    });
};
