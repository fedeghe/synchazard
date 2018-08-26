
function createToken(l) {
    "use strict";
    var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        len = set.length,
        out = '';
    while (l--) 
        out += set[~~(len * Math.random())];
    return out;
}

function mix(tokens, n) {
    "use strict";
    var m = '',
        nStr = "" + n,
        i = 0,
        j = 1,
        tLen = tokens.length,
        l = nStr.length;
    for (null; j <= 7; j++)
        for (i = 0; i < l; i++)
            m += tokens[i % tLen][j * nStr[i]];
    return m;
}