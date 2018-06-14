module.exports.launch = (action, socketSrv, params) => {

    "use strict";
    
    action.onconnection((data, ws) => {
        if (data.___TYPE === 'action') {
            switch (data.___ACTION) {
                case 'test':
                    console.log(data)
                    break;
                default:break;
            }
        }
    });
};