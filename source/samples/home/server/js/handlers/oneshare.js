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
                oneShare.sharedArea.updateSharedFiles(data._PAYLOAD.files)
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
