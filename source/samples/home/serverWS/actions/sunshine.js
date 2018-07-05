module.exports.launch = (action, synchazard, params) => {

    "use strict";

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
        index : 0, 
        size: 3
    });

    const sliceRot = (a, i, howmany) => {
        const len = a.length;
        i = i % len;
        const rot = i < len && (i + howmany) > len;
        return rot ?
            [].concat(a.slice(i), a.slice(0, howmany - (len - i)))
            :
            a.slice(i, i + howmany);
    };
    
    // INIT
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
        }
    });

    // RUN
    //
    setInterval(() => {
        action.data.index++;
        synchazard.broadcast(action.encodeMessage({
            _ACTION: 'sunshine',
            _PAYLOAD: sliceRot(action.data.colors, action.data.index, action.data.size)
        }));
    }, 1000);
};