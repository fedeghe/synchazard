module.exports.launch = (action, synchazard /* , params */) => {
    const nodeList = {},
        disable = (id, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = id;
            nodeList[nodeId].value = nodeList[nodeId].value || '';
            return action.encodeMessage({
                _ACTION: 'disableAll',
                _VALUE: nodeList[nodeId].value,
                _NODEID: `${nodeId  }`
            }, { id: id });
        },
        enable = (id, value, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].clients = nodeList[nodeId].clients || [];
            nodeList[nodeId].clients.indexOf(id) > -1 || nodeList[nodeId].clients.push(id);
            nodeList[nodeId].gotToken = false;
            nodeList[nodeId].value = value;
            return action.encodeMessage({
                _ACTION: 'enableAll',
                _VALUE: `${value  }`,
                _NODEID: `${nodeId  }`
            }, { id: id });
        },
        getNodes = () => {
            return action.encodeMessage({
                _ACTION: 'updateInitStatus',
                _NODE_LIST: nodeList
            });
        },
        resize = (id, sizes, nodeId) => {
            nodeList[nodeId] = nodeList[nodeId] || {};
            nodeList[nodeId].sizes = sizes;
            return action.encodeMessage({
                _ACTION: 'resize',
                _SIZES: sizes,
                _NODEID: `${nodeId  }`
            }, { id: id });
        };

    // CONNECTION
    //
    // eslint-disable-next-line no-unused-vars
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                synchazard.broadcast(getNodes());
                break;
            case 'disable':
                synchazard.broadcast(disable(data._ID, data._NODEID));
                break;
            case 'enable':
                synchazard.broadcast(enable(data._ID, data._VALUE, data._NODEID));
                break;
            case 'resize':
                synchazard.broadcast(resize(data._ID, data._SIZES, data._NODEID));
                break;
            default: break;
        }
    });
};
