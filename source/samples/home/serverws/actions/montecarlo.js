module.exports.launch = (action, synchazard /* , params */) => {
    let askingingCli = null,
        pendingPartecipants = 0,
        currentResult = 0,
        available = null;

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
        free: true,
        // clients: 0,
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
            busy: action.encodeMessage({
                _ACTION: 'busy'
            }),
            free: action.encodeMessage({
                _ACTION: 'free'
            }),
            update: () => {
                const response = {
                    _ACTION: 'updatedComputation',
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
    // eslint-disable-next-line complexity
    action.onconnection((data, ws, req) => {
        // console.log(req)
        
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                // synchazard.unicast(data._ID, action.data.actions.update());
                // since the source is the sender the unicast (that needs the id)
                // can be replaced with ws.send

                available = action.getSize(data._URL);

                ws.send(action.data.actions.update());
                if (!action.data.free) {
                    synchazard.unicast(data._ID, action.data.actions.busy);
                } else {
                    pendingPartecipants = available - 1;
                    synchazard.broadcast(action.data.actions.free);
                    // on askMontecarlo in case will be reset correctly
                }
                if (available <= 1) {
                    ws.send(action.data.actions.noClients);
                }
                break;
            case 'askMontecarlo':
                // block if already busy
                if (!action.data.free) break;
                
                // store it as the one who triggered,
                // used in `update` action
                askingingCli = data._ID;

                // there are other clients on this page available?
                available = action.getSize(data._URL);
                
                if (available > 1) {
                    // lock it
                    action.data.free = false;
                    // broadcast the status so the client can disable the button
                    synchazard.broadcast(action.data.actions.busy);

                    // synchazard.broadcast(action.data.actions.ask(askingingCli));
                    // or with some variations also on the sender client (to filter itself, it knows his id )
                    synchazard.otherscast(data._ID, action.data.actions.ask(askingingCli)).then(ids => {
                        pendingPartecipants = ids.length;
                    });
                    // or even 
                    // pendingPartecipants = Object.keys(available.ID).length
                } else {
                    // synchazard.unicast(data._ID, action.data.actions.noClients);
                    // same here
                    ws.send(action.data.actions.noClients);
                }
                break;
            case 'acceptedMontecarlo':
                ws.send(action.data.actions.proceed);
                // synchazard.unicast(data._ID, action.data.actions.thx);
                // same here
                ws.send(action.data.actions.thx);

                break;
            case 'rejectedMontecarlo':
                --pendingPartecipants;
                action.data.free = pendingPartecipants === 0;
                if (action.data.free) {
                    // broadcast the status so the client can reenable the button
                    synchazard.broadcast(action.data.actions.free);
                    askingingCli = null;
                }
                break;
                
            case 'joinMontecarlo':
                // the client sent back his contribution
                // store it!
                if (pendingPartecipants > 0) {
                    results.inside += data._DATA.inside;
                    results.outside += data._DATA.outside;
                    // thus one partecipant has done
                    --pendingPartecipants;
                }

                // broadcast the results
                // if there are no more pendingPartecipants then
                // it is time, maybe, to reenable it
                synchazard.broadcast(action.data.actions.update()).then((r) => {
                    // time to re-enable it
                    action.data.free = pendingPartecipants === 0;
                    if (action.data.free) {
                        // broadcast the status so the client can reenable the button
                        synchazard.broadcast(action.data.actions.free);
                        askingingCli = null;
                    }
                });
                
                break;
            default:break;
        }
    }, (data /* , ws, req */) => {
        if (data._ACTION === 'close') {
            // console.log('0', pendingPartecipants)
            pendingPartecipants && --pendingPartecipants;

            // console.log('1', pendingPartecipants)
            // time to re-enable it, maybe
            action.data.free = pendingPartecipants === 0;

            available = action.getSize(data._URL);
            if (available < 2) {
                synchazard.broadcast(action.data.actions.noClients);
            
            // console.log(pendingPartecipants);
            // broadcast the status so the client can reenable the button
            } else {
                synchazard.broadcast(action.data.actions.free);
            }
            
        }
    });
};
