(function () {

    //
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //
    function Share () {}
    Share.prototype.handle = function (data) {
        console.log('cli gets ', data )
    }
    console.log(oneShare)
    oneShare.shareArea.onAdd = function () {console.log('share add', arguments)}
    oneShare.shareArea.onRemove = function () {console.log('share remove', arguments)}
    oneShare.sharedArea.onAdd = function () {console.log('shared add', arguments)}
    oneShare.sharedArea.onRemove = function () {console.log('shared remove', arguments)}

    maltaV('NS').handlers.oneShare = new Share()

})();
