module.exports.launch = (action /* , synchazard, params */) => {
    // Manager
    maltaF('matchManager.js')

    // just listen
    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;

        console.log(data);
        
        switch (data._ACTION) {
            case 'init':
                /**
                 * check if qs contains all needed for a match
                 */

                /**
                 * otherwise simply init
                 */
                ws.send(action.encodeMessage({
                    _ACTION: 'init',
                    _PAYLOAD: {
                        originalRequest: data
                    }
                }));
                break;
            case 'initMatch':
                ws.send(action.encodeMessage({
                    _ACTION: 'matchCreated',
                    // eslint-disable-next-line no-undef
                    _PAYLOAD: Manager.createMatch()
                }));
                break;
            case 'joinMatch':
                ws.send(action.encodeMessage({
                    _ACTION: 'matchJoined',
                    _PAYLOAD: []
                }));
                break;
            case 'saveMatch':
                ws.send(action.encodeMessage({
                    _ACTION: 'matchSaved',
                    // eslint-disable-next-line no-undef
                    _PAYLOAD: Manager.saveMatch(data)
                }));
                break;
            default: 
                console.log('DEFAULT REACHED:');
                console.log(data);
                break
        }
    });
};