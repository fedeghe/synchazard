/* eslint-disable no-undef */
/**
 * THIS IS MY DOM
 */
CL.bom = {};

CL.bom.qs2obj = function () {
    var qs = document.location.search.match(/\?(.*)/);
    return qs
        ? qs[1].split('&').reduce(
            function (acc, el) {
                var ke = el.match(/(.*)=(.*)/);
                if (ke) {
                    acc[ke[1]] = decodeURIComponent(ke[2]);
                }
                return acc;
            }, {}
        )
        : {};
};
