module.exports.launch = (action, synchazard/* , params */) => {
    let askingingCli = null,
        pendingPartecipants = 0,
        doneClis = [],
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
                return action.encode({
                    _ACTION: 'requestRandomPairs'
                }, { id: id });
                // the id here is not reaaly usefull since 
                // we use otherscast; it is if we use broadcast 
                // (and we even have to activete the folter on the clients handler)
            },
            thx: action.encode({
                _ACTION: 'thx',
                _MSG: 'thank You very much'
            }),
            proceed: action.encode({
                _ACTION: 'startComputation',
                _JOB: 'generate'
            }),
            noClients: action.encode({
                _ACTION: 'noClients'
            }),
            busy: action.encode({
                _ACTION: 'busy'
            }),
            free: action.encode({
                _ACTION: 'free'
            }),
            update: () => {
                const response = {
                    _ACTION: 'updatedComputation',
                    _PREVIOUS: currentResult,
                    _STATS: results
                };
                // calculate new PI, ...and put it directly in the data results
                response._DATA = calcPi(results);
                // include the error, based on the value of Math.PI, limited to 7 digits
                response._ERR = (100 * (Math.PI - parseFloat(response._DATA, 10)) / Math.PI).toFixed(7)
                // save the local most up to date result 
                currentResult = response._DATA;
                // return the action including the requiring client id
                return action.encode(response, { id: askingingCli });
            }
        }
    });

    // CONNECTION
    //
    // eslint-disable-next-line complexity
    action.onConnect((data, ws /* , req */ ) => {
        if(!action.checkRequestActor(data)) return;
        
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                // since the source is the sender the unicast (that needs the id)
                // can be replaced with ws.send

                // get the static count from Action, restricted to this url
                available = action.getSize(data._URL);

                // send back to the connecting client the most up to date data
                ws.send(action.data.actions.update());

                // in any case
                // if the wsserver is not busy, then broadcast to all clients
                // so they are aknowledged the wsserver is free to accept comnputing requests
                // otherw
                action.data.free
                ? synchazard.broadcast(action.data.actions.free)
                : synchazard.send(action.data.actions.busy);// same as the following
                // : synchazard.unicast(data._ID, action.data.actions.busy);

                // in case that there are not ehough clients
                // let the only client be aware
                available <= 1
                && ws.send(action.data.actions.noClients);

                break;
            case 'askMontecarlo':
                
                // block if already busy
                if (!action.data.free) break;

                doneClis = [];
                
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

                    // otherscast the collaboration request
                    synchazard.otherscast(data._ID, action.data.actions.ask(askingingCli)).then(ids => {
                        pendingPartecipants = ids.length;
                    });
                    // or even 
                    // pendingPartecipants = Object.keys(available.ID).length
                } else {
                    // synchazard.unicast(data._ID, action.data.actions.noClients);
                    // in this case same as
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
                doneClis.push(data._ID)

                // broadcast the results
                // if there are no more pendingPartecipants then
                // it is time, maybe, to reenable it
                synchazard.broadcast(action.data.actions.update()).then(() => {
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
    })
    .onDisconnect((data /* , ws, req */) => {
        
        // console.log(action.getCount());
        // console.log(data);

        if (doneClis.includes(data._ID)) {
            return;
        }

        if (data._ACTION === 'close') {
            pendingPartecipants && --pendingPartecipants;

            // time to re-enable it, maybe
            action.data.free = pendingPartecipants <= 0;
            
            available = action.getSize(data._URL);
            if (available < 2) {
                synchazard.broadcast(action.data.actions.noClients);
                // broadcast the status so the client can reenable the button
            } else {
                synchazard.broadcast(action.data.actions.free);
            }
        }
    })
    .start();
};
