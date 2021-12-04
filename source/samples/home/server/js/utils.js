// eslint-disable-next-line no-unused-vars
function prefixNumber(n) {
    var snum = String(n),
        snlen = snum.length,
        pref = '';
    switch(true) {
        case snlen > 24: pref = 'Y'; break;
        case snlen > 21: pref = 'Z'; break;
        case snlen > 18: pref = 'E'; break;
        case snlen > 15: pref = 'P'; break;
        case snlen > 12: pref = 'T'; break;
        case snlen > 9: pref = 'G'; break;
        case snlen > 6: pref = 'M'; break;
        case snlen > 3: pref = 'K'; break;
        default: 
          break;
    }
    while (n > 1E3) {
      n /= 1E3
    }
    return n.toFixed(2) + pref;
}
// eslint-disable-next-line no-unused-vars
function whatChanged(o/* old */, n/* new */) {
    var res = [],
          nS = String(n),
          oS = String(o),
          l = Math.min(oS.length, nS.length),
          response = null,
          i = 0;
    for (null; i < l; i++) {
      if (nS[i] === oS[i]){
        res.push(oS[i])
      } else break;
    }
    response = res.join('');
    return {
        stable: response,
        unstable: nS.replace(response, '')
    }
  }