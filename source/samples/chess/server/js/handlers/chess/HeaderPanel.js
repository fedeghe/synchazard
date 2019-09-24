/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function HeaderPanel () {
    this.container = CL.dom.create({ tag: 'div', cls: 'headerContainer' });
    this.header = CL.dom.create({ tag: 'div', cls: 'header' });

    this.logoSection = CL.dom.create({ tag: 'div', cls: 'headerSection logoSection' });
    this.logo = CL.dom.create({ tag: 'div', cls: 'logo',  html: 'ChessHero' });
    this.logoSection.appendChild(this.logo);

    this.messageSection = CL.dom.create({ tag: 'div', cls: 'headerSection messageSection' });
    this.message = CL.dom.create({ tag: 'span', cls: 'message', html : 'asdfsdfsd' });
    this.messageSection.appendChild(this.message)

    this.buttonSection = CL.dom.create({ tag: 'div', cls:'headerSection buttonSection' });
    this.startGameButton = CL.dom.create({ tag: 'div', cls: 'startButton' });
    this.buttonSection.appendChild(this.startGameButton);

    this.header.appendChild(this.logoSection);
    this.header.appendChild(this.messageSection);
    this.header.appendChild(this.buttonSection);
    this.container.appendChild(this.header);
    this.startGameButton.addEventListener('click', function () {
        // send straight the action
        maltaV('NS').send({ _ACTION: 'createMatch' });
    });
}
