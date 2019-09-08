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
    action.onConnect((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
            case 'init':
                ws.send(action.encode({
                    _ACTION: 'sunshine',
                    _PAYLOAD: sliceRot(action.data.colors, action.data.index, action.data.size)
                }));
                break;
            default: break;
        }
    }).start();

    // RUN
    //
    interval(() => {
        action.data.index++;
        synchazard.broadcast(action.encode({
            _ACTION: 'sunshine',
            _PAYLOAD: sliceRot(action.data.colors, action.data.index, action.data.size)
        }));
    }, 60E3).run();
};
