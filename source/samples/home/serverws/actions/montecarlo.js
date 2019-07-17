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
        // a flag to manage concurrent askMontecarlo requests
        busy: false,
        clients: 0,
        actions: {
            ask: (id) => {
                return action.encodeMessage({
                    _ACTION: 'requestRandomPairs'
                }, { id: id });
                // the id here is not reaaly usefull since 
                // we use otherscast; it is if we use broadcast 
                // (and we even have to activete the folter on the clients handler)
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
    action.onconnection((data, ws, req) => {
        // console.log(req)
        let available = null;
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                // synchazard.unicast(data._ID, action.data.actions.completed());
                // since the source is the sender the unicast (that needs the id)
                // can be replaced with ws.send
                ws.send(action.data.actions.completed());
                break;
            case 'askMontecarlo':
                // block if already busy
                if (action.data.busy) break;
                // lock it
                action.data.busy = true;
                // store it as the one who triggered, used in `completed` action
                askingingCli = data._ID;
                // there are other clients on this page available?
                available = action.getCount();
                if (available.URL[data._URL].length > 1) {
                    // synchazard.broadcast(action.data.actions.ask(askingingCli));
                    // or with some variations also on the sender client (to filter itself, it knows his id )
                    synchazard.otherscast(data._ID, action.data.actions.ask(askingingCli)).then(ids => {
                        partecipants = ids.length;
                    });
                    // or even 
                    // partecipants = Object.keys(available.ID).length
                } else {
                    // synchazard.unicast(data._ID, action.data.actions.noClients);
                    // same here
                    ws.send(action.data.actions.noClients);
                }
                break;
            case 'acceptedMontecarlo':
                // partecipants++;
                ws.send(action.data.actions.proceed);

                // synchazard.unicast(data._ID, action.data.actions.thx);
                // same here
                ws.send(action.data.actions.thx);

                break;
            case 'joinMontecarlo':
                if (partecipants) {
                    results.inside += data._DATA.inside;
                    results.outside += data._DATA.outside;
                }
                --partecipants;
                if ( partecipants === 0) {
                    synchazard.broadcast(action.data.actions.completed()).then((r) => {
                        console.log('ids: ', r);
                        action.data.busy = false;
                    });
                }
                break;
            default:break;
        }
    });
};
