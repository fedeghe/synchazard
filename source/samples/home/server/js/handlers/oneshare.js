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
                console.log(data._PAYLOAD)
                oneShare.sharedArea.setContent(data._PAYLOAD.file.content, data._PAYLOAD.file.filePath);
                break;
            case 'requestPwd':
                // short circuit
                var pwd = prompt('This file is pwd protected, enter it');
                maltaV('NS').send({
                    _ACTION: 'checkPwd',
                    _USER: data._PAYLOAD.uid,
                    _FILE: data._PAYLOAD.file,
                    _PWD: pwd
                });
                break;
            case 'wrongPwd': 
                alert('Wrong pwd');
                break;
            default:
                console.log('ERR: unhandled action')
                break;
        }
    };

    // HOOKS
    //
    oneShare.shareArea.onAdd = function (file, pwd) {
        maltaV('NS').send({ _ACTION: 'addShare', _FILE: file, _PWD: pwd });
    };
    oneShare.shareArea.onRemove = function (file) {
        maltaV('NS').send({ _ACTION: 'removeShare', _FILE: file });
    };
    oneShare.shareArea.onLocalUpdate = function (file) {
        maltaV('NS').send({ _ACTION: 'updateShare', _FILE: file });
    }
    oneShare.sharedArea.onSelectTab = function (file, user) {
        maltaV('NS').send({ _ACTION: 'getContent', _FILE: file, _USER: user});
    };
    oneShare.sharedArea.onAdd = function (file, user) {
        maltaV('NS').send({ _ACTION: 'addObserver', _FILE: file, _USER: user });
    };
    oneShare.sharedArea.onRemove = function (file, user) {
        maltaV('NS').send({ _ACTION: 'removeObserver', _FILE: file, _USER: user });
    };

    maltaV('NS').handlers.oneShare = new Share();
})();
