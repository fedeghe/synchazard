/* eslint-disable guard-for-in */
(function () {

    //
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //
    function Share () {}
    Share.prototype.handle = function (data) {
        console.log('cli gets ', data );
        switch(data._ACTION) {
            case 'userFiles':
                console.log('HEHEHEEHEHHEHE')
                for(var userK in data._PAYLOAD.files) {
                    data._PAYLOAD.files[userK].forEach( function (f) {
                        oneShare.sharedArea.filePoolSelect.addFile(f.filePath, userK)
                    })
                }
                break;
            default:
                console.log(data._ACTION)
                
                break;
        }
    };
    console.log(oneShare)
    oneShare.shareArea.onAdd = function (file) {
        // console.log('share add', arguments);
        maltaV('NS').send({
            _ACTION: 'addShare',
            _FILE: file
        });
    }
    oneShare.shareArea.onRemove = function () {
        console.log('share remove', arguments);x
    };
    oneShare.shareArea.onLocalUpdate = function (file) {
        console.log('local Update', arguments);
        console.log('the new Content is ', file.content)
        maltaV('NS').send({
            _ACTION: 'updateShare',
            _FILE: file,

        });
    }

    oneShare.sharedArea.onAdd = function () {console.log('shared add', arguments)};
    oneShare.sharedArea.onRemove = function () {console.log('shared remove', arguments)};

    maltaV('NS').handlers.oneShare = new Share();
})();
