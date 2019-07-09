
// eslint-disable-next-line no-unused-vars
function createToken (l) {
    var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        len = set.length,
        out = '';
    while (l--) {
        out += set[~~(len * Math.random())];
    }
    return out;
}

// eslint-disable-next-line no-unused-vars
function mix (tokens, n) {
    var m = '',
        nStr = `${  n}`,
        i = 0,
        j = 1,
        tLen = tokens.length,
        l = nStr.length;
    for (null; j <= 7; j++) {
        for (i = 0; i < l; i++) {
            m += tokens[i % tLen][j * nStr[i]];
        }
    }
    return m;
}

// eslint-disable-next-line no-unused-vars
function toQs (o) {
    var r = [],
        i;
    for (i in o) {
        r.push(`${i  }=${  encodeURIComponent(o[i])}`);
    }
    return `?${  r.join('&')}`;
}
