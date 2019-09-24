// eslint-disable-next-line no-unused-vars
var config = {
    pieces: {
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
    frontPlayer: 'white',
    backPlayer: 'black',
    mode: 'filled',// filled, empty
    rows: [1, 2, 3, 4, 5, 6, 7, 8],
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    // columns: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    // columns: ['&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;']
    // columns: ['&Alpha;', '&Beta;', '&Gamma;', '&Delta;', '&Epsilon;', '&Zeta;', '&Eta;', '&Theta;']
};
