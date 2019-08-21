/**
 *
 */
(function () {

    function createElement(tag, attrs, html) {
        var t = document.createElement(tag),
            i;
        for (i in attrs) {
            if (attrs.hasOwnProperty(i)) {
                t.setAttribute(i, attrs[i])
            }
        }
        html && (t.innerHTML = html);
        return t;
    }
    function doRender() {
        this.target.appendChild(this.main)
    }

    function ShareArea(trg) {
        this.target = trg;
        this.init();
        this.sharedFileList = [];
    }
    ShareArea.prototype.init = function () {
        var self = this;
        this.main = createElement('div', {'class' : 'shareArea'})
        this.dropArea = createElement('div', {'class' : 'shareAreaDrop'}, 'share a file by dragging it here')
        
        this.fileList = createElement('ul', {'class' : 'shareAreaButtons'})
        this.detail = createElement('p', {'class' : 'shareAreaDetail'})
        this.fileList.addEventListener('click', function (e) {
            var trg = e.target,
                trgtag = trg.tagName;
            if (trgtag === 'SPAN') {
                self.removeFile(trg.parentNode);
            }
        });
        this.fileList.addEventListener('mouseover', function (e) {
            var trg = e.target,
                trgtag = trg.tagName;
            if (trgtag === 'LI') {
                self.detail.innerHTML = `FULL PATH: ${trg.dataset.path}`
            }
        });
        this.fileList.addEventListener('mouseout', function (e) {
            var trg = e.target,
                trgtag = trg.tagName;
            if (trgtag === 'LI') {
                self.detail.innerHTML = '';
            }
        });

        this.dropArea.addEventListener('dragover', this.handleDragOver, false);
        this.dropArea.addEventListener('drop', this.handleFileSelect, false);

        this.main.appendChild(this.dropArea)    
        this.main.appendChild(this.fileList)
        this.main.appendChild(this.detail)
    };
    ShareArea.prototype.handleDragOver = function (e) {
        console.log('Dragging over ', +new Date)
        console.log(e)
        e.preventDefault();
    };
    ShareArea.prototype.handleFileSelect = function (e) {
        console.log('Dropping over ', +new Date)
        console.log(e)
        e.preventDefault();
    };
    ShareArea.prototype.addFile = function (filename) {
        var elems = filename.match(/(.*)\/([^/]*)/),
            filePath = elems ? elems[1] : '',
            fileName = elems ? elems[2] : filename,
            fileItem = createElement('li', {'class': 'file'}, fileName),
            closeIcon = createElement('span', {'class': 'close', title:'stop sharing that file'}, '&times;');
        fileItem.dataset.path = [filePath, fileName].join('/')
        fileItem.dataset.observers = 0
        fileItem.appendChild(closeIcon);
        this.sharedFileList.push(filename);
        this.fileList.appendChild(fileItem);
        this.onAdd && this.onAdd(this, fileItem.dataset.path);
    };    
    ShareArea.prototype.removeFile = function (node) {
        this.fileList.removeChild(node)
        this.onRemove && this.onRemove(this, node.dataset.path);
    };
    ShareArea.prototype.render = function () {
        doRender.call(this);
    };


    function SharedArea(trg) {
        this.target = trg;
        this.activeTab = null;
        this.init();
    }
    SharedArea.prototype.init = function  () {
        var self = this;
        this.main = createElement('div', {'class' : 'sharedArea'});

        this.filePoolSelect = new FilePoolSelect(this.main, this);
        this.filePoolSelect.render()

        this.tabList = createElement('ul', {'class' : 'tabList'});
        this.tabs = [];
        this.tabContent = createElement('div', {'class' : 'tabContent hide'});
        this.tabContentTextarea = createElement('textarea', {'class' : 'content'});
        
        this.panel = createElement('div', {'class' : 'contentPanel'});
        this.panelButton = createElement('button', {'class' : 'contentPanelButton'}, 'Download');

        this.panel.appendChild(this.panelButton)
        this.tabContent.appendChild(this.panel)
        this.tabContent.appendChild(this.tabContentTextarea)
        this.main.appendChild(this.tabList)
        this.count = 0;
        
        
        this.main.appendChild(this.tabContent)
        

        this.tabList.addEventListener('click', function(e){
            var trg = e.target,
                tag = trg.tagName;
            switch(tag) {
                case 'LI':
                    self.selectTab(trg)
                    break;
                case 'SPAN':
                    self.removeTab(trg.parentNode)
                    break;
                default:;
            }
        })
    };
    SharedArea.prototype.addFile = function(file){
        // add the tabtongue && activate content && disable from the select
        var content = `... loading content for ... ${file}`;
        this.addTab(file)
        this.tabContentTextarea.innerHTML = content;
        this.tabContent.classList.remove('hide')
    };
    SharedArea.prototype.addTab = function(filen){
        var split = filen.split('___'),
            user = split[0],
            file = split[1],
            tab = createElement('li', {'class': 'tabTongue active', title: filen}, file),
            close = createElement('span', {'class':'close'}, '&times;');

        this.activeTab && this.activeTab.classList.remove('active')
        this.tabs.push(tab);
        tab.dataset.user = user; 
        tab.dataset.file = file; 
        tab.appendChild(close)
        this.tabList.appendChild(tab)
        this.activeTab = tab
        this.onAdd && this.onAdd(tab)
    };
    SharedArea.prototype.removeTab = function(tag){
        var removingActive = tag.classList.contains('active'),
            t = tag.title.split('___').reverse();

        this.tabs = this.tabs.filter(function (tab) {return tab.title !== tag.title});
        this.filePoolSelect.enableFile(t[0], t[1])
        
        if (this.tabs.length === 0) {
            this.tabContent.classList.add('hide')
        } else if (removingActive) {
            this.tabs[0].click();
        }
        this.tabList.removeChild(tag)
        this.onRemove && this.onRemove(tag)
    };
    SharedArea.prototype.activateTab = function(tag){
        this.activeTab.classList.remove('active')
        this.activeTab = tag;
        tag.classList.add('active');
    }
    SharedArea.prototype.selectTab = function(tag){
        this.activateTab(tag);
        this.setContent(tag.title);
    };
    SharedArea.prototype.setContent = function (cnt) {
        this.tabContentTextarea.innerHTML = cnt;
    };
    SharedArea.prototype.render = function  () {
        doRender.call(this);
    };

    function FilePoolSelect(trg, parentInstance) {
        this.parentInstance = parentInstance;
        this.target = trg;
        this.optGroups = {}
        this.userFiles = {}
        this.init();
    }
    FilePoolSelect.prototype.init = function () {
        var self = this;
        this.main = createElement('select', {'class':'filelist'})
        this.firstOption = createElement('option', {value: ''}, 'no files available')
        this.main.appendChild(this.firstOption);
        this.main.addEventListener('change', function (e) {
            var val = e.target.value;
            self.parentInstance.addFile(val)
            self.disableFile.apply(self, val.split('___').reverse())
            self.main.value = '';
            self.main.blur();
        })
        this.fileCount = 0;
    };
    FilePoolSelect.prototype.addFile = function (file, user) {
        var newOption,
            optGroup,
            mustAppend = false;

        if (!(user in this.optGroups)) {
            this.optGroups[user] = createElement('optGroup', {label: user});
            mustAppend = true;
        }
        optGroup = this.optGroups[user];
        
        if (!(user in this.userFiles)) {
            this.userFiles[user] = {};
        }
        if (!(file in this.userFiles[user])) {
            this.userFiles[user][file] = 0; // the 0 is the number of users looking at it
            this.fileCount++;
        } else {
            return;
        }
        newOption = createElement('option', {value: `${user}___${file}`}, file);
        optGroup.appendChild(newOption);
        mustAppend && this.main.appendChild(optGroup);

        this.firstOption.innerHTML = this.fileCount > 0
        ? `${this.fileCount} files shared (select one or more)`
        : 'no files available'
    };
    FilePoolSelect.prototype.removeFile = function (file, user) {
        var self = this;
        if (user in this.userFiles && file in this.userFiles[user]) {
            delete(this.userFiles[user][file])
            this.fileCount--;
            
            Array.from(this.optGroups[user].children).forEach(function (child) {
                if (child.value === `${user}___${file}`) {
                    self.optGroups[user].removeChild(child)
                }
            })
            if (this.optGroups[user].children.length === 0) {
                this.main.removeChild(this.optGroups[user])
                delete(this.optGroups[user])
            }

            if (this.fileCount > 0) {
                this.firstOption.innerHTML = `${this.fileCount} files available`;
            } else {
                this.firstOption.innerHTML = 'no files available';
            }
        }
    };
    FilePoolSelect.prototype.disableFile = function (file, user) {
        Array.from(this.optGroups[user].children).forEach(function (child) {
            if (child.value === `${user}___${file}`) {
                child.setAttribute('disabled', 'disabled')
            }
        })
    };
    FilePoolSelect.prototype.enableFile = function (file, user) {
        Array.from(this.optGroups[user].children).forEach(function (child) {
            if (child.value === `${user}___${file}`) {
                child.removeAttribute('disabled')
            }
        })
    };
    FilePoolSelect.prototype.removeAll = function () {
        this.main.innerHTML = ''
        this.firstOption.innerHTML = 'no files available'
        this.main.appendChild(this.firstOption)
    };
    FilePoolSelect.prototype.render = function () {
        doRender.call(this);
    };

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    window.addEventListener('load', function () {
        var target = document.getElementById('target'),
            shareArea = new ShareArea(target),
            hr = createElement('div', {'class': 'hr'}),
            sharedArea = new SharedArea(target);
        shareArea.render();
        target.appendChild(hr)
        sharedArea.render();

        window.oneShare = {
            shareArea,
            sharedArea
        }

        // oneShare.shareArea.addFile('./../../../helloworld/server/js/workers/worker_helloWorld.js')
        // oneShare.shareArea.addFile('aab.js')
        // oneShare.shareArea.addFile('aac.js')
        // oneShare.shareArea.addFile('aad.js')
        // oneShare.sharedArea.filePoolSelect.addFile('aaa.js', 'Federico')
        // oneShare.sharedArea.filePoolSelect.addFile('bbb.js', 'Federico')
        // oneShare.sharedArea.filePoolSelect.addFile('ccc.js', 'Federico')
        // oneShare.sharedArea.filePoolSelect.addFile('aaa.js', 'Gabri')
        // oneShare.sharedArea.filePoolSelect.addFile('bbb.js', 'Gabri')

        
        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });


    
})();
