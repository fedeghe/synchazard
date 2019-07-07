(function () {
    'use strict';

    /**
     * ChessLib
     */
    // eslint-disable-next-line no-unused-vars
    var CL = {},
        game = null;

    /* eslint-disable */
    $$chess/config.js$$
    $$chess/exceptions.js$$
    $$chess/Dom.js$$
    $$chess/Bom.js$$
    $$chess/Channel.js$$
    $$chess/Chess.js$$
    /* eslint-enable */

    /**
     * publish the handler
     */
    $NS$.handlers.chessManager = {
        handle: (d) => {
            if (d._TYPE !== 'action') {
                return;
            }
            switch (d._ACTION) {
            case 'init':
                // eslint-disable-next-line no-undef
                game = new Chess(
                    document.getElementById('trg')
                );
                game.start(d);
                game.checkQs();
                break;
            case 'matchCreated':
                console.log('Consume the link');
                console.log(d);
                game.newGameLink(d);
                break;
            default:
                console.log('default:');
                console.log(d);
                break;
            }
        }
    };
})();
