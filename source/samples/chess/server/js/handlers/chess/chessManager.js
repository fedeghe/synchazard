(function () {
    "use strict";

    /**
     * ChessLib
     */
    var CL = {};

    $$chess/config.js$$
    $$chess/exceptions.js$$
    $$chess/Dom.js$$
    $$chess/Channel.js$$
    $$chess/Chess.js$$

    /**
     * publish the handler
     */
    $NS$.handlers.chessManager = new ChessManager(document.getElementById('trg'));
})();



