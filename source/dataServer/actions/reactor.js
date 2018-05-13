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
                ___TYPE: 'reactor',
                ___ACTION: 'disableAll',
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
                ___TYPE: 'reactor',
                ___ACTION: 'enableAll',
                ___VALUE: val + "",
                ___NODEID: nodeId + ""
            }, id);
        },
        getNodeList = () => {
            return action.encodeMessage({
                ___TYPE: 'reactor',
                ___ACTION: 'updateInitStatus',
                ___NODE_LIST: nodeList
            });
        };
    
    // RUN
    action.onconnection((data, ws) => {
        
        if (data.___TYPE === 'action') {
            action.notify(__filename, data);
            switch (data.___ACTION) {
                case 'init':
                    socketSrv.broadcast(getNodeList());
                    break;
                case 'disable':
                    socketSrv.broadcast(disable(data.___ID, data.___NODEID));
                    break;
                case 'enable':
                    socketSrv.broadcast(enable(data.___ID, data.___VALUE, data.___NODEID));
                    break;
            }
        }
    });
};
