/* eslint-disable no-undef */
Widgzard.events.ready(function () {
    // eslint-disable-next-line no-unused-vars
    var app = Widgzard.render({
        content: [
            {
            tag: 'script',
            attrs: { src: '/js/handlers/meier.js'},
            end: function () {
                Widgzard.dom.remove(this.node);
            }
        },{
            tag: 'h1',
            html: 'Meier',
            attrs: {
                class: 'title'
            }
        },{
            wid: 'panel'
        }, {
            wid: 'buttons'
        }]
    });
});
    
    




