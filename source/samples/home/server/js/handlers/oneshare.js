/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
(function () {

    //
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //
    function Share () {}
    Share.prototype.handle = function (data) {
        switch(data._ACTION) {
            case 'sharedFiles':
                oneShare.sharedArea.updateSharedFiles(data._PAYLOAD.files)
                break;
                
            case 'shareAdded':
                oneShare.sharedArea.addSharedFile(data._PAYLOAD);
                break;

            case 'shareRemoved':
                oneShare.sharedArea.removeSharedFile(data._PAYLOAD);
                break;

            case 'filecontent':
                oneShare.sharedArea.setContent(data._PAYLOAD.filecontent);
                break;

            case 'updatedContent':
                // valid only if is the viewed one
                oneShare.sharedArea.setContent(data._PAYLOAD.file.content);
                break;

            default:
                console.log('ERR: unhandled action')
                break;
        }
    };

    oneShare.shareArea.onAdd = function (file) {
        maltaV('NS').send({
            _ACTION: 'addShare',
            _FILE: file
        });
    };

    oneShare.shareArea.onRemove = function (file) {
        maltaV('NS').send({
            _ACTION: 'removeShare',
            _FILE: file
        });
    };

    oneShare.shareArea.onLocalUpdate = function (file) {
        // eslint-disable-next-line prefer-rest-params
        maltaV('NS').send({
            _ACTION: 'updateShare',
            _FILE: file,
        });
    }

    //
    // =============================================>
    //

    oneShare.sharedArea.onSelectTab = function (file, user) {
        maltaV('NS').send({
            _ACTION: 'getContent',
            _FILE: file,
            _USER: user,
        });
    };

    oneShare.sharedArea.onAdd = function (file, user) {
        maltaV('NS').send({
            _ACTION: 'addObserver',
            _FILE: file,
            _USER: user,
        });
    };

    oneShare.sharedArea.onRemove = function (file, user) {
        maltaV('NS').send({
            _ACTION: 'removeObserver',
            _FILE: file,
            _USER: user,
        });
    };

    maltaV('NS').handlers.oneShare = new Share();
})();
