function HeaderPanel() {
    var self = this;
    this.container = CL.dom.create({ tag: 'div', cls: 'headerContainer' });
    this.startGameButton = CL.dom.create({ tag: 'button', cls: 'startButton' });
    this.startGameButton.innerHTML = 'StartMatch';
    this.container.appendChild(this.startGameButton);

    this.startGameButton.addEventListener('click', function () {
        $NS$.send({ _ACTION: 'initMatch' });
    });
}