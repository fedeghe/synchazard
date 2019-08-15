/**
 *
 */
maltaF('../../../../../node_modules/widgzard/dist/theWidgzard.js')
(function () {
    // Widgzard
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
                    component: 'button',
                    params: {name: 'xxx.js'},
                    onClick: function () {
                        console.log('one')
                    }
                },{
                    component: 'button',
                    params: {name: 'yyy.js'}
                },{
                    component: 'button',
                    params: {name: 'zzz.js'}
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
                tag:'button',
                html : 'add',
                onClick: function () {
                    var n = this.getNode('xxx')
                    n.data.add.call(n, 'Hello.js')
                }
            },{
                tag: 'ul',
                wid:'xxx',
                attrs: {'class':'tabList'},
                data: {
                    active : 0,
                    changeContent: function(content) {
                        var cnt = this.getNode('content')
                        // debugger;
                        cnt.node.innerHTML = content
                    },
                    add: function (filename) {
                        console.log(this)
                        this.conf.content.push({
                            component: 'tabTongue',
                            params: {
                                label: filename,
                                title: 'shared By Jonas',
                                contentRef: filename
                            }
                        })
                        console.log(this.conf.content)
                        this.render();
                    }
                },
                content: [{
                    component: 'tabTongue',
                    params: {
                        key : 0,
                        label: 'File0.js',
                        title: 'shared By Jonas',
                        contentRef: 'aaaaaaaaaaa'
                    }
                },{
                    component: 'tabTongue',
                    params: {
                        key : 1,
                        label: 'File1.js',
                        title: 'shared By Jonas',
                        contentRef: 'bbbbbbbbbbb'
                    }
                },{
                    component: 'tabTongue',
                    params: {
                        key : 2,
                        label: 'File2.js',
                        title: 'shared By Jonas',
                        contentRef: 'cccccccccccc'
                    }
                }]
            }, {
                attrs: {'class':'tabContent'},
                content: [{
                    tag: 'textarea',
                    wid: 'content',
                    attrs:{'class': 'content'}
                }]
            }]
        }]
    }

    Engy.configSet({
        // fileNamePrepend: '$COMPONENTS.NAME_PREPEND$',
        ext: '.js',
        componentsUrl: 'js/oneshare/'
    });

    window.addEventListener('load', function () {
        var target = document.getElementById('target');
        conf.target = target
        Engy.render(conf, true);
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
