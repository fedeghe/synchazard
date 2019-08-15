var _ = {
    tag: 'li',
    data: {
        contentRef: '#PARAM{contentRef}',
        key: '#PARAM{key}'
    },
    attrs: {
        'class': 'tabTongue #PARAM{cls}',
        title: '#PARAM{title}'
    },
    html: '#PARAM{label}',
    content: [{
        tag: 'span',
        attrs: {'class':'close'},
        html: '&times;',
        onClick: function (e) {
            var self = this,
            grandpa = self.parent.parent;
            grandpa.conf.content = grandpa.conf.content.filter(function (cnt) {
                return cnt.data.key !== self.parent.data.key
            });
            self.getNode('content').node.innerHTML = '';
            grandpa.render();
            e.stopPropagation()
        }
    }],
    onClick: function () {
        var self = this,
            {parent} = self;
        parent.data.changeContent.call(this, this.data.contentRef)
        parent.data.active = self.data.key;
        parent.render();
    },
    end: function() {
        var self = this,
            {parent} = self;
        
        if (parent.data.active === self.data.key) {
            self.node.classList.add('active')
            console.log(self.node.classList)
            console.log(`adding active to item ${self.data.key}`)
        }
    }
}