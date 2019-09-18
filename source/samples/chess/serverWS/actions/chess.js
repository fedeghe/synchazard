module.exports.launch = (action /* , synchazard, params */) => {
    // Manager
    maltaF('matchManager.js')

    // just listen
    //
    action.onConnect((data, ws) => {
        let gotNewMatch = false;
        if (data._TYPE !== 'action') return;

        console.log("DATA: ");
        console.log(data);
        console.log("------------\n\n");
        
        switch (data._ACTION) {
            case 'init':
                /**
                 * check if qs contains all needed for a match
                 */
                gotNewMatch = Manager.checkLink(data);
                if (gotNewMatch) {
                    console.log('sending init match data')
                    ws.send(action.encode({
                        _ACTION: 'matchCreated',
                        _PAYLOAD: {
                            initData: gotNewMatch
                        }
                    }));
                    break;
                }
                
                /**
                 * otherwise simply init
                 */
                ws.send(action.encode({
                    _ACTION: 'init',
                    _PAYLOAD: {
                        originalRequest: data
                    }
                }));
                break;
            case 'initMatch':
                ws.send(action.encode({
                    _ACTION: 'matchCreated',
                    // eslint-disable-next-line no-undef
                    _PAYLOAD: Manager.createMatch()
                }));
                break;
                
            case 'joinMatch':
                ws.send(action.encode({
                    _ACTION: 'matchJoined',
                    _PAYLOAD: []
                }));
                break;
            case 'saveMatch':
                ws.send(action.encode({
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
    }).start();
};