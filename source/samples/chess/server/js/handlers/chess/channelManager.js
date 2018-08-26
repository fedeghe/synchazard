CL.channelManager = {
    channel: CL.Channel('chess')
};

CL.channelManager.init = function () {

    this.channel.sub('initMatch', function () {
        $NS$.send({ _ACTION: 'initMatch' });
    });
    
};

CL.channelManager.init();