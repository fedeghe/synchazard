/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function HeaderPanel () {
    this.container = CL.dom.create({ tag: 'div', cls: 'headerContainer' });
    this.header = CL.dom.create({ tag: 'div', cls: 'header' });

    this.startGameButton = CL.dom.create({ tag: 'button', cls: 'startButton' });
    this.startGameButton.innerHTML = 'StartMatch';
    this.header.appendChild(this.startGameButton);
    this.container.appendChild(this.header);
    this.startGameButton.addEventListener('click', function () {
        // send straight the action
        maltaV('NS').send({ _ACTION: 'createMatch' });
    });
}
