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
                    ___ACTION: 'requestRandomPairs'
                }, id);
            },
            thx: action.encodeMessage({
                ___ACTION: 'thx',
                ___MSG: 'thank You very much'
            }),
            proceed: action.encodeMessage({
                ___ACTION: 'startComputation',
                ___JOB: 'generate'
            }),
            completed: function (r) {
                return action.encodeMessage({
                    ___ACTION: 'endComputation',
                    ___DATA: r
                }, askingingCli);
            }
        }
    });

    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'askMontecarlo':
                askingingCli = data.___ID;
                synchazard.broadcast(action.data.actions.ask(askingingCli));
                break;
            case 'acceptedMontecarlo':
                partecipants++;
                ws.send(action.data.actions.proceed);
                synchazard.unicast(data.___ID, action.data.actions.thx);
                break;
            case 'joinMontecarlo':
                if (partecipants) {
                    results.inside += data.___DATA.inside;
                    results.outside += data.___DATA.outside;
                }
                partecipants--;
                if (partecipants == 0) {
                    synchazard.broadcast(action.data.actions.completed(
                        results.outside ? calcPi(results) : 1
                    ));
                    break;
                }
                break;
        }
    });
};