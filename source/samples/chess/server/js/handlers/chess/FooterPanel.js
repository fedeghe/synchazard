/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function FooterPanel () {
    this.container = CL.dom.create({ tag: 'div', cls: 'footerContainer' });
    this.init();
}

FooterPanel.prototype.init = function () {
    this.container.innerHTML = 'This is the footer';
};
