module.exports.launch = (action, synchazard, params) => {
    'use strict';

    action.onconnection((data, ws) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
        case 'test':
            console.log(data);
            break;
        default:break;
        }
    });
};
