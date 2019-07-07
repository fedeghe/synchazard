module.exports.launch = (action, synchazard, params) => {
    'use strict';
    let askingingCli = null,
        partecipants = 0,
        results = {
            inside: 0,
            outside: 0
        };

    const calcPi = data => results.outside
        ? 4 * data.inside / (data.inside + data.outside)
        : NaN;

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
                return action.encodeMessage({
                    _ACTION: 'endComputation',
                    _DATA: calcPi(results)
                }, { id: askingingCli });
            }
        }
    });

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
        case 'init':
            synchazard.unicast(data._ID, action.data.actions.completed());
            break;
        case 'askMontecarlo':
            askingingCli = data._ID;
            // there are other clients on this page available?
            const ava = action.getCount();
            if (ava.URL[data._URL].length > 1) {
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
        }
    });
};
