module.exports.launch = (action, synchazard /* , params */) => {
    let askingingCli = null,
        partecipants = 0,
        currentResult = 0;

    const baseValue = 3,
        results = {
            inside: 0,
            outside: 0
        },
        calcPi = data => results.outside
            ? 4 * data.inside / (data.inside + data.outside)
            : baseValue;

    // SETUP
    //
    action.setup({
        clients: 0,
        actions: {
            ask: (id) => {
                return action.encodeMessage({
                    _ACTION: 'requestRandomPairs'
                }, { id: id });
            },
            thx: action.encodeMessage({
                _ACTION: 'thx',
                _MSG: 'thank You very much'
            }),
            proceed: action.encodeMessage({
                _ACTION: 'startComputation',
                _JOB: 'generate'
            }),
            noClients: action.encodeMessage({
                _ACTION: 'noClients'
            }),
            completed: () => {
                const response = {
                    _ACTION: 'endComputation',
                    _PREVIOUS: currentResult,
                    _STATS: results
                };
                response._DATA = calcPi(results);
                response._ERR = (100 * (Math.PI - parseFloat(response._DATA, 10)) / Math.PI).toFixed(7)
                currentResult = response._DATA;
                return action.encodeMessage(response, { id: askingingCli });
            }
        }
    });

    // CONNECTION
    //
    action.onconnection((data, ws) => {
        let available = null;
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                synchazard.unicast(data._ID, action.data.actions.completed());
                break;
            case 'askMontecarlo':
                askingingCli = data._ID;
                // there are other clients on this page available?
                available = action.getCount();
                if (available.URL[data._URL].length > 1) {
                    synchazard.broadcast(action.data.actions.ask(askingingCli));
                } else {
                    synchazard.unicast(data._ID, action.data.actions.noClients);
                }
                break;
            case 'acceptedMontecarlo':
                partecipants++;
                ws.send(action.data.actions.proceed);
                synchazard.unicast(data._ID, action.data.actions.thx);
                break;
            case 'joinMontecarlo':
                if (partecipants) {
                    results.inside += data._DATA.inside;
                    results.outside += data._DATA.outside;
                }
                !--partecipants && synchazard.broadcast(action.data.actions.completed());
                break;
            default:break;
        }
    });
};
