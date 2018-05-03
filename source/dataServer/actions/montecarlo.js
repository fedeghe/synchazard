module.exports.launch = (action, socketSrv, params) => {

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
                    ___TYPE: 'requestRandomPairs'
                }, id);
            },
            proceed: action.encodeMessage({
                ___TYPE: 'startComputation',
                ___JOB: 'generate'
            }),
            completed: function (r) {
                var x = action.encodeMessage({
                    ___TYPE: 'endComputation',
                    ___DATA: r
                }, askingingCli);
                return x;
            }
        }
    });

    action.onconnection((data, ws) => {
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'askMontecarlo':
                    askingingCli = data.___ID;
                    socketSrv.broadcast(action.data.actions.ask(askingingCli));
                    break;
                case 'acceptedMontecarlo':
                    partecipants++;
                    ws.send(action.data.actions.proceed);
                    break;
                case 'joinMontecarlo': 
                    if (partecipants){
                        results.inside += data.___DATA.inside;
                        results.outside += data.___DATA.outside;
                    }
                    partecipants--;
                    if (partecipants == 0) {
                        socketSrv.broadcast(action.data.actions.completed(
                            results.outside ? calcPi(results) : 1
                        ));
                        break;
                    }
                    break;
            }
        }
    });
};