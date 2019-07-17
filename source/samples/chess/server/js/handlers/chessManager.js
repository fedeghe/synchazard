(function () {
    

    /**
     * ChessLib
     */
    // eslint-disable-next-line no-unused-vars
    var CL = {},
        game = null,
        trg = document.getElementById('trg');

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
        handle: (data) => {
            if (data._TYPE !== 'action') {
                return;
            }
            switch (data._ACTION) {
                case 'init':
                    // eslint-disable-next-line no-undef
                    game = new Chess(trg);
                    game.start(data);
                    game.checkQs();
                    break;
                case 'matchCreated':
                    console.log('Consume the link');
                    console.log(data);
                    game = new Chess(trg);
                    game.newGameLink(data);
                    break;
                case 'matchStarted':
                    // eslint-disable-next-line no-undef
                    game = new Chess(trg);
                    game.start(data);
                    game.checkQs();
                    break;
                default:
                    console.log('default:');
                    console.log(data);
                    break;
            }
        }
    };
})();
