/* eslint-disable no-undef */
/**
 * THIS IS MY DOM
 */
CL.dom = {};

CL.dom.create = function (params) {
    var n;
    params.tag = params.tag || 'div';
    n = document.createElement(params.tag);
    params.cls && (n.className = params.cls);
    params.html && (n.innerHTML = params.html);
    return n;
};
