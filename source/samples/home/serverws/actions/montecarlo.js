module.exports.launch = (action, synchazard, params) => {

    "use strict";

    let askingingCli = null,
        partecipants = 0,
        results = {
            inside: 0,
            outside: 0
        };

    const calcPi = data => 4 * data.inside / (data.inside + data.outside);

    action.setup({
        actions: {
            ask: function (id) {
                return action.encodeMessage({
                    _ACTION: 'requestRandomPairs'
                }, {id: id});
            },
            thx: action.encodeMessage({
                _ACTION: 'thx',
                _MSG: 'thank You very much'
            }),
            proceed: action.encodeMessage({
                _ACTION: 'startComputation',
                _JOB: 'generate'
            }),
            completed: function (r) {
                return action.encodeMessage({
                    _ACTION: 'endComputation',
                    _DATA: r
                }, {id: askingingCli});
            }
        }
    });

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'askMontecarlo':
                askingingCli = data._ID;
                synchazard.broadcast(action.data.actions.ask(askingingCli));
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
                partecipants--;
                if (partecipants == 0) {
                    const a = action.data.actions.completed(
                        results.outside ? calcPi(results) : 1
                    );
                    synchazard.broadcast(a);
                    break;
                }
                break;
        }
    });
};