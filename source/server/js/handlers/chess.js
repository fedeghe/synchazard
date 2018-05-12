(function () {
    "use strict";

    var pieces = {
            names: {
                k: 'king',
                q: 'queen',
                r: 'rook',
                b: 'bishop',
                n: 'knight',
                p: 'pawn'
            },
            filled: {
                king: '&#9818;',
                queen: '&#9819;',
                rook: '&#9820;',
                bishop: '&#9821;',
                knight: '&#9822;',
                pawn: '&#9823;'
            },
            empty: {
                king: '&#9812;',
                queen: '&#9813;',
                rook: '&#9814;',
                bishop: '&#9815',
                knight: '&#9816',
                pawn: '&#9817;'
            },
            posdown: {
                white: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr',
                black: 'rnbkqbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKQBNR'
            },
            movements: {
                k: '*{1}',
                q: '*{*}',
                r: '+{*}',
                b: 'x{*}',
                n: 'L',
                p: 'up[2]|V[A]'
            }
        },
        mode = 'filled';

    
    function Chess(sel) {
        this.target = document.querySelector(sel);
        this.target.innerHTML = '';
        this.cells = [];
        if (!this.target) throw 'NO target found';
        // down wite or black?
        this.down = 'black';
    }
    
    Chess.prototype.init = function() {
        this.initBoard();
        this.renderFEN(pieces.posdown.black);
    };

    Chess.prototype.renderFEN = function (fen) {
        this.validateFEN(fen);
        var self = this,
            createPuppet = function (code, cls) {
                var n = document.createElement('span');
                n.className = 'piece ' + cls;
                n.innerHTML = code;
                return n;
            },
            tokens= fen.split(/\//),
            cursor = 0;
        tokens.forEach(function(token, i) {
            var i = 0, l = token.length, lowercase, ch, tmp;
            for (null; i < l; i++) {
                
                ch = token[i].toLowerCase(); 
                if (token[i].match(/^[1-9]{1}$/)){
                    cursor += parseInt(token[i]);
                } else if (token[i].match(/^[R|N|B|Q|K|P]{1}$/i)) {
                    lowercase = token[i].charCodeAt(0) >= 97;
                    tmp = pieces[mode][pieces.names[ch]];
                    self.cells[cursor].appendChild(createPuppet(tmp, lowercase ? 'white' : 'black'));
                    cursor += 1;
                }
                
            }
        });

        
    };

    Chess.prototype.validateFEN = function (fen) {
        // TODO
        if (false) throw new Error('Fen invalid');
    };

    Chess.prototype.initBoard = function () {
        var i = 0,
            j = 0,
            l = 8,
            tmp,
            board = document.createElement('div'),
            self = this;
        board.className = 'board';
        this.target.className = 'boardContainer';


        function createNode(cls){
            var n = document.createElement('div');
            n.className = cls;
            cls === 'cell' && self.cells.push(n);
            return n;
        }
        for (i = 0; i < l; i++) {
            tmp = createNode('row');
            for (j = 0; j < l; j++) {
                tmp.appendChild(createNode('cell'));
            }
            board.appendChild(tmp);
        }
        this.target.appendChild(board);
    };



    Chess.prototype.handle = function (d) {
        console.log('handle')
        console.log(d)
        if (d.___TYPE !== 'action') return;
        switch (d.___ACTION) {
            case 'init':
                this.init();
                break;
        }
    };

    $NS$.handlers.chess = new Chess('#trg');

})();



