(function () {
    

    /**
     * ChessLib
     */
    // eslint-disable-next-line no-unused-vars
    var CL = {},
        game = null;

    /* eslint-disable */
    maltaF('chess/config.js')
    maltaF('chess/exceptions.js')
    maltaF('chess/Dom.js')
    maltaF('chess/Bom.js')
    maltaF('chess/Channel.js')
    maltaF('chess/Chess.js')
    /* eslint-enable */

    /**
     * publish the handler
     */
    maltaV('NS').handlers.chessManager = {
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
