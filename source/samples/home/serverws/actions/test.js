module.exports.launch = (action, synchazard, params) => {

    "use strict";
    
    action.onconnection((data, ws) => {
        if (data.___TYPE !== 'action') return;
        switch (data.___ACTION) {
            case 'test':
                console.log(data)
                break;
            default:break;
        }
    });
};