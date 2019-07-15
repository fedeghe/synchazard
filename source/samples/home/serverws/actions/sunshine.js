const interval = require('@fedeghe/interval');

module.exports.launch = (action, synchazard /* , params */) => {

    // SETUP
    //
    action.setup({
        colors: [
            '#126',
            '#626',
            '#F3C142',
            '#F70',
            '#07F'
        ],
        index: 0,
        size: 3
    });

    const sliceRot = (a, i, howmany) => {
        const len = a.length;
        i %= len;
        return (i + howmany) > len
            ? [].concat(a.slice(i), a.slice(0, howmany - (len - i)))
            : a.slice(i, i + howmany);
    };

    //
    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encodeMessage({
                    _ACTION: 'sunshine',
                    _PAYLOAD: sliceRot(action.data.colors, action.data.index, action.data.size)
                }));
                break;
            default: break;
        }
    });

    // RUN
    //
    interval(() => {
        action.data.index++;
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'sunshine',
            _PAYLOAD: sliceRot(action.data.colors, action.data.index, action.data.size)
        }));
    }, 60E3).run();
};
