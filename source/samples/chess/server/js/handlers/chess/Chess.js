
/* eslint-disable */
maltaF('chess/headerPanel.js')
maltaF('chess/footerPanel.js')
/* eslint-enable */
/* eslint-disable no-undef */

function Chess (trg) {
    this.target = trg;
    this.target.innerHTML = '';
    this.cells = [];
    if (!this.target) {
        throw new Error('NO target found');
    }
    this.gameContainer = null;
    this.headerPanel = new HeaderPanel();
    this.footerPanel = new FooterPanel();
}

Chess.prototype.cleanup = function () {
    this.target.innerHTML = '';
    this.cells = [];
    return this;
};

Chess.prototype.init = function () {
    this.prepare();
    this.render();
    this.renderFEN(config.pieces.posdown[config.start]);
    return this;
};

Chess.prototype.renderFEN = function (fen) {
    this.validateFEN(fen);
    var self = this,
        tokens = fen.split(/\//),
        cursor = 0;

    tokens.forEach(function (token) {
        var i = 0,
            l = token.length,
            color,
            ch,
            tmp;
        for (null; i < l; i++) {
            ch = token[i].toLowerCase();
            if (token[i].match(/^[1-9]{1}$/)) {
                cursor += parseInt(token[i]);
            } else if (token[i].match(/^[R|N|B|Q|K|P]{1}$/i)) {
                color = token[i].charCodeAt(0) >= 97 ? 'white' : 'black';
                tmp = config.pieces[config.mode][config.pieces.names[ch]];
                self.cells[cursor].appendChild(
                    CL.dom.create({
                        tag: 'span',
                        html: tmp,
                        cls: `piece ${color}`
                    })
                );
                cursor += 1;
            }
        }
    });
};

Chess.prototype.validateFEN = function (fen) {
    // eslint-disable-next-line
    if (false) {
        throw new Error('Fen invalid');
    }
};

Chess.prototype.initBoardersContainer = function () {
    this.boardersContainer = CL.dom.create({ tag: 'div', cls: 'boardersContainer' });
    var i = 0,
        l = 8,
        tmp1, tmp2, tmp3, tmp4,
        getAlgebraicBorder = function (cl1, b) {
            return CL.dom.create({ tag: 'div', cls: [cl1, b, config.start].join(' ') });
        },
        algBorders = {
            left: getAlgebraicBorder('brdRows', 'left'),
            right: getAlgebraicBorder('brdRows', 'right'),
            top: getAlgebraicBorder('brdColumns', 'top'),
            bottom: getAlgebraicBorder('brdColumns', 'bottom')
        };

    for (i = 0; i < l; i++) {
        tmp1 = CL.dom.create({
            cls: 'brdRow',
            html: config.rows[i]
        });
        tmp2 = tmp1.cloneNode(true);
        tmp3 = CL.dom.create({
            cls: 'brdColumn',
            html: config.columns[i]
        });
        tmp4 = tmp3.cloneNode(true);
        algBorders.left.appendChild(tmp1);
        algBorders.right.appendChild(tmp2);
        algBorders.bottom.appendChild(tmp3);
        algBorders.top.appendChild(tmp4);
    }
    this.boardersContainer.appendChild(algBorders.left);
    this.boardersContainer.appendChild(algBorders.right);
    this.boardersContainer.appendChild(algBorders.bottom);
    this.boardersContainer.appendChild(algBorders.top);
    this.boardContainer.appendChild(this.boardersContainer);
};

Chess.prototype.initBoard = function () {
    this.board = CL.dom.create({ tag: 'div', cls: 'board' });
    var i = 0,
        j = 0,
        l = 8,
        row,
        cell;
    for (i = 0; i < l; i++) {
        row = CL.dom.create({ cls: 'row' });
        for (j = 0; j < l; j++) {
            cell = CL.dom.create({ cls: 'cell' });
            this.cells.push(cell);
            row.appendChild(cell);
        }
        this.board.appendChild(row);
    }
    this.boardContainer.appendChild(this.board);
};

Chess.prototype.initBoardContainer = function () {
    this.boardContainer = CL.dom.create({ tag: 'div', cls: 'boardContainer' });
    this.initBoardersContainer();
    this.initBoard();
};

Chess.prototype.prepare = function () {
    this.gameContainer = CL.dom.create({ tag: 'div', cls: 'gameContainer' });
    this.initBoardContainer();
    this.gameContainer.appendChild(this.headerPanel.container);
    this.gameContainer.appendChild(this.boardContainer);
    this.gameContainer.appendChild(this.footerPanel.container);
};

Chess.prototype.render = function (d) {
    this.target.appendChild(this.gameContainer);
};

/**
 * entry point for events
 */
Chess.prototype.newGameLink = function (d) {
    console.log(d._PAYLOAD.link);
};
Chess.prototype.start = function (d) {
    console.log('Start Chess');
    console.log(d);
    this.cleanup().init();
};
Chess.prototype.checkQs = function () {
    var qs = CL.bom.qs2obj();
    console.log(qs);
};
