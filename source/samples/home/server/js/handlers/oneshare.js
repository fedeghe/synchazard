(function () {

    //
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //
    function Share () {}
    Share.prototype.handle = function (data) {
        console.log('cli gets ', data )
    };
    console.log(oneShare)
    oneShare.shareArea.onAdd = function () {
        console.log('share add', arguments);
    }
    oneShare.shareArea.onRemove = function () {
        console.log('share remove', arguments);
    };
    oneShare.shareArea.onLocalUpdate = function (file) {
        console.log('local Update', arguments);
        console.log('the new Content is ', file.content)
    }

    oneShare.sharedArea.onAdd = function () {console.log('shared add', arguments)};
    oneShare.sharedArea.onRemove = function () {console.log('shared remove', arguments)};

    maltaV('NS').handlers.oneShare = new Share();
})();
