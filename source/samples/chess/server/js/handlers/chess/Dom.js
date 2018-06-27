/**
 * THIS IS MY DOM
 */
CL.dom = {};

CL.dom.create = function (params) {
    params.tag = params.tag || 'div';
    var n = document.createElement(params.tag);
    params.cls && (n.className = params.cls);
    params.html && (n.innerHTML = params.html);
    return n;
};
