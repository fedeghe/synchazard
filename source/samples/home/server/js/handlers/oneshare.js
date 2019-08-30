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
            case 'sharedFiles':
                oneShare.sharedArea.filePoolSelect.removeAll();


                Object.keys(data._PAYLOAD.files)
                .filter(function (k) {return k !== SH.id} ) 
                .forEach(function (k) {
                    data._PAYLOAD.files[k].forEach( function (f) {
                        oneShare.sharedArea.filePoolSelect.addFile(f.filePath, k)
                    });
                })

                // for(var userK in data._PAYLOAD.files) {

                //     data._PAYLOAD.files[userK].forEach( function (f) {
                //         oneShare.sharedArea.filePoolSelect.addFile(f.filePath, userK)
                //     });
                // }

                break;
            default:
                console.log(data._ACTION)
                
                break;
        }
    };

    oneShare.shareArea.onAdd = function (file) {
        // console.log('share add', arguments);
        maltaV('NS').send({
            _ACTION: 'addShare',
            _FILE: file
        });
    };

    oneShare.shareArea.onRemove = function (file) {
        // console.log('share remove', arguments);
        maltaV('NS').send({
            _ACTION: 'removeShare',
            _FILE: file
        });
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
