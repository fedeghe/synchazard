Widgzard.events.ready(function () {
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
    
    




