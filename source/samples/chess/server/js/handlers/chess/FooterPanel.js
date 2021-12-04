/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function FooterPanel () {
    this.container = CL.dom.create({ tag: 'div', cls: 'footerContainer' });
    this.footer = CL.dom.create({ tag: 'div', cls: 'footer' });

    this.init();
}

FooterPanel.prototype.init = function () {
    this.footer.innerHTML = 'This is the footer';
    this.container.appendChild(this.footer)
};
