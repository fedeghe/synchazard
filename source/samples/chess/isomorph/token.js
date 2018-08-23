
function createToken(l) {
    "use strict";
    var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        len = set.length,
        out = '';
    while (l--) 
        out += set[~~(len * Math.random())];
    return out;
}

function mix(t1, t2, n) {
    "use strict";
    var m = '',
        nStr = `${n}`,
        i = 0,
        j = 1,
        l = nStr.length;
    for (null; j <= 7; j++)
        for (i = 0; i < l; i++)
            m += (i % 2 ? t1 : t2)[j * nStr[i]];
    return m;
}