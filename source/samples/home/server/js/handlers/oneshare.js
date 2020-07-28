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
        var pwd;
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
                oneShare.sharedArea.setContent(data._PAYLOAD.file.content, data._PAYLOAD.file.filePath);
                break;

            case 'updatedContent':
                // valid only if is the viewed one
                oneShare.sharedArea.setContent(data._PAYLOAD.file.content, data._PAYLOAD.file.filePath);
                break;
            case 'requestPwd':
                // short circuit
                // eslint-disable-next-line no-alert
                pwd = prompt('This file is pwd protected, enter it');
                maltaV('NS').send({
                    _ACTION: 'checkPwd',
                    _USER: data._PAYLOAD.uid,
                    _FILE: data._PAYLOAD.file,
                    _PWD: pwd
                });
                break;
            case 'wrongPwd': 
                oneShare.sharedArea.setContent('Wrong password provided, close the tab and provide the right one.');
                break;

            // the user receives back the content of the file he shared
            case 'myfilecontent':
                oneShare.shareArea.modeler.toggle(true);
                oneShare.shareArea.modeler.setContent(data._PAYLOAD.file);
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
    oneShare.shareArea.BPMNgetMyContent = function (file) {
        maltaV('NS').send({ _ACTION: 'BPMNgetMyContent', _FILE: file });
    }
    oneShare.shareArea.BPMNupdateMyContent = function (filename, xml) {
        maltaV('NS').send({ _ACTION: 'BPMNupdateMyContent', _FILENAME: filename, _CONTENT: xml });
    }
    //
    // ------------------------------------------------------------
    //
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
