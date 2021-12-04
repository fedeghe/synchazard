module.exports.launch = (action /* , synchazard, params */) => {
    
    action.onConnect((data /* , ws */) => {
        if (data._TYPE !== 'action') return;
        switch (data._ACTION) {
        case 'test':
            console.log(data);
            break;
        default:break;
        }
    }).start();
};
