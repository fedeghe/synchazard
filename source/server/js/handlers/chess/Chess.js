function Chess(sel) {
    this.target = document.querySelector(sel);
    this.target.innerHTML = '';
    this.cells = [];
    if (!this.target) throw 'NO target found';
    // down wite or black?
    this.down = 'black';
}

Chess.prototype.cleanup = function () {
    this.target.innerHTML = '';
    this.cells = [];
    return this;
};
Chess.prototype.init = function () {
    this.initBoard();
    this.renderFEN(config.pieces.posdown[config.start]);
    return this;
};

Chess.prototype.renderFEN = function (fen) {
    this.validateFEN(fen);
    var self = this,
        tokens = fen.split(/\//),
        cursor = 0;

    tokens.forEach(function (token, i) {
        var i = 0, l = token.length, color, ch, tmp;
        for (null; i < l; i++) {
            ch = token[i].toLowerCase();
            if (token[i].match(/^[1-9]{1}$/)) {
                cursor += parseInt(token[i]);
            } else if (token[i].match(/^[R|N|B|Q|K|P]{1}$/i)) {
                color = token[i].charCodeAt(0) >= 97 ? 'white' : 'black';
                tmp = config.pieces[config.mode][config.pieces.names[ch]];
                self.cells[cursor].appendChild(
                    CL.dom.create({
                        tag : 'span',
                        html: tmp,
                        cls: 'piece ' + color
                    })
                );
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
        row,
        cell,
        tmp1, tmp2, tmp3, tmp4,

        getAlgebraicBorder = function(cl1, b) {
            return CL.dom.create({ tag: 'div', cls: [cl1, b, config.start].join(' ') });
        },
        gameContainer = CL.dom.create({ tag: 'div', cls: 'gameContainer'}),
        boardContainer = CL.dom.create({ tag: 'div', cls: 'boardContainer'}),
        boardersContainer = CL.dom.create({ tag: 'div', cls: 'boardersContainer'}),
        headerContainer = CL.dom.create({ tag: 'div', cls: 'headerContainer'}),
        footerContainer = CL.dom.create({ tag: 'div', cls: 'footerContainer'}),
        board = CL.dom.create({ tag: 'div', cls: 'board'}),
        algBorders = {
            left: getAlgebraicBorder('brdRows', 'left'),
            right: getAlgebraicBorder('brdRows', 'right'),
            top: getAlgebraicBorder('brdColumns', 'top'),
            bottom: getAlgebraicBorder('brdColumns', 'bottom')
        },
        brdColumns = CL.dom.create({tag:'div', cls:'brdColumns bottom '+ config.start}),
        brdRows = CL.dom.create({ tag: 'div', cls: 'brdRows left ' + config.start}),
        self = this;

    // this.target.className = 'gameContainer';

    for (i = 0; i < l; i++) {
        row = CL.dom.create({cls: 'row'});
        for (j = 0; j < l; j++) {
            cell = CL.dom.create({cls:'cell'});
            self.cells.push(cell)
            row.appendChild(cell);
        }
        board.appendChild(row);
    }

    for (i = 0; i < l; i++) {
        tmp1 = CL.dom.create({
            cls: 'brdRow',
            html: config.rows[i]
        }),
        tmp2 = tmp1.cloneNode(true),
        tmp3 = CL.dom.create({
            cls: 'brdColumn',
            html: config.columns[i]
        }),
        tmp4 = tmp3.cloneNode(true);
        algBorders.left.appendChild(tmp1);
        algBorders.right.appendChild(tmp2);
        algBorders.bottom.appendChild(tmp3);
        algBorders.top.appendChild(tmp4);
    }

    boardersContainer.appendChild(algBorders.left);
    boardersContainer.appendChild(algBorders.right);
    boardersContainer.appendChild(algBorders.bottom);
    boardersContainer.appendChild(algBorders.top);
    boardContainer.appendChild(boardersContainer);
    boardContainer.appendChild(board);
    gameContainer.appendChild(headerContainer);
    gameContainer.appendChild(boardContainer);
    gameContainer.appendChild(footerContainer);
    this.target.appendChild(gameContainer);
};



/**
 * entry point for events
 */
Chess.prototype.handle = function (d) {
    if (d.___TYPE !== 'action') return;
    switch (d.___ACTION) {
        case 'init':
            this.cleanup().init();
            break;
    }
};