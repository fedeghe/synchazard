/**
 *
 */
maltaF('../../../../../node_modules/widgzard/dist/theWidgzard.js')
(function () {

    var conf = {
        attrs : {'class': 'target'},
        content: [{
            content: [{
                data: {
                    files: []
                },
                attrs : {'class': 'shareAreaDrop'},
                onDragover: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    // console.log(e)
                },
                onDrop: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    var {files} = e.dataTransfer, // FileList object.

            // files is a FileList of File objects. List some properties.
                        output = [];
                    for (var i = 0, f; f = files[i]; i++) {
                        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                            f.size, ' bytes, last modified: ',
                            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                            '</li>');
                        this.data.files.push(f);
                    }
                    

                    this.conf.html = output.join('');
                    this.render();
                },
                cb: function () {
                    var self = this;
                    clearInterval(self.data.intr);
                    self.data.intr = setInterval(function() {
                        var {files} = self.data;
                        files.forEach(function (file){
                            console.log(`${file.name} ${file.lastModifiedDate}`);
                            self.conf.html = `${file.name} ${file.lastModifiedDate}`;
                            self.render();
                        } )
                    }, 1000)
                    this.done();
                },
                html : 'Share a file dragging it here',
                content: [{
                    tag: 'button',
                    html : 'stop sharing all files'
                }]
            }, {
                tag: 'ul',
                attrs: {'class':'shareAreaButtons'},
                content: [{
                    tag: 'li',
                    attrs: {'class': 'file'},
                    html: 'xxx.js',
                    content: [{
                        tag: 'span',
                        attrs: {
                            'class': 'close'
                        },
                        html : '&times;'
                    }]
                },{
                    tag: 'li',
                    attrs: {'class': 'file'},
                    html: 'yyy.js',
                    content: [{
                        tag: 'span',
                        attrs: {
                            'class': 'close'
                        },
                        html : '&times;'
                    }]
                }]
            }],
            attrs : {'class': 'shareArea'}
        }, {
            attrs: {
                'class': 'sharedArea',  
            },
            content: [{
                tag: 'p',
                attrs: {'class': 'title'},
                html: 'List of shared files:',
                content: [{
                    tag: 'select',
                    attrs: {'class':'filelist'},
                    content: [{
                        tag: 'option',
                        attrs: {dafault: '', value: ''},
                        html: 'choose a file'
                    }]
                }, {
                    tag: 'span',
                    text: '(4 elements available)'
                }]
            }, {
                tag: 'ul',
                attrs: {'class':'tabList'},
                content: [{
                    tag: 'li',
                    attrs: {
                        'class': 'tabTongue active',
                        title: 'shared By Jonas'
                    },
                    html: 'File1.js',
                    content: [{
                        tag: 'span',
                        attrs: {'class':'close'},
                        html: '&times;'
                    }]
                },{
                    tag: 'li',
                    attrs: {
                        'class': 'tabTongue',
                        title: 'shared By Jonas'
                    },
                    html: 'File2.js',
                    content: [{
                        tag: 'span',
                        attrs: {'class':'close'},
                        html: '&times;'
                    }]
                }]
            }, {
                attrs: {'class':'tabContent'},
                content: [{
                    tag: 'textarea',
                    attrs:{'class': 'content'}
                }]
            }]
        }]
    }


    window.addEventListener('load', function () {
        var target = document.getElementById('target');
        conf.target = target
        Widgzard.render(conf, true);
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
