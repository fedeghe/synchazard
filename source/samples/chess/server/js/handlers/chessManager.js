(function () {
    "use strict";

    /**
     * ChessLib
     */
    var CL = {},
        game = null;
    
    $$chess/config.js$$
    $$chess/exceptions.js$$
    $$chess/Dom.js$$
    $$chess/Bom.js$$
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
                    game = new Chess(
                        document.getElementById('trg')
                    );
                    game.start(d);
                    game.checkQs();
                    break;
                case 'matchCreated':
                    console.log("Consume the link");
                    console.log(d);
                    game.newGameLink(d);
                    break;
                default: 
                    console.log('default:')
                    console.log(d);
                    break;
            }
        }
    };
})();



