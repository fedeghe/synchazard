(function () {
    var head = document.getElementsByTagName('head')[0];
    function remove() {
        head.removeChild(this);
    }
    maltaV('NS').utils.loadScript('/js/handlers/helloWorld.js', remove);
})();