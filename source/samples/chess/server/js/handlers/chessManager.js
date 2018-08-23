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
    $NS$.handlers.chessManager = {
        handle: (d) => {
            if (d._TYPE !== 'action')return;
            switch (d._ACTION) {
                case 'init':
                    var game = new Chess(document.getElementById('trg'));
                    game.start(d);
                    break;
            }
        }
    };
})();



