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
        this.sh_sharedFileList = [];
        this.locallyObserved = [];
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

        this.dropArea.addEventListener('dragover', this.handleDragOver.bind(this), false);
        this.dropArea.addEventListener('drop', this.handleFileSelect.bind(this), false);

        this.main.appendChild(this.dropArea)    
        this.main.appendChild(this.fileList)
        this.main.appendChild(this.detail)
        this.startWatching()
    };
    ShareArea.prototype.handleDragOver = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        console.log('Dragging over ', +new Date)
        console.log(evt)
    };



    /**
     * the fila has just been dropped and we just need to 
     * - quiet the dafault event handling/propagating
     * - alert the server a new file from this client is available to be shared
     * - save it among the locallyObserved ones so that at the watching loop we do not miss it
     */
    ShareArea.prototype.handleFileSelect = function (evt) {
        var files = evt.dataTransfer.files,
            i = 0,
            len = 0,
            file,
            self = this;
        
        evt.preventDefault();
        evt.stopPropagation();
        
        // can handle more files in one drop
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i]
            // eslint-disable-next-line one-var, vars-on-top
            var reader = new FileReader(),
                // eslint-disable-next-line no-unused-vars
                obj = {file: file, name: file.name, date : file.lastModifiedDate, content : null, reader : reader};

            // eslint-disable-next-line no-loop-func
            reader.onload = (function() {
                return function(e) {
                    // content available
                    obj.content =  e.target.result;
                    self.addFile(obj)
                    self.locallyObserved.push(obj);
                };
            })(file);
            reader.readAsDataURL(file);
        }
    };
    ShareArea.prototype.startWatching = function () {
        var self = this,
            inter = 500;

        setInterval(function () {
            self.locallyObserved.forEach(function (observed) {
                if (observed.file.lastModifiedDate > (+new Date - inter)) {
                    observed.date = +new Date;
                    observed.reader.onload = (function(obs) {
                        return function(e) {
                            observed.content =  e.target.result;
                            self.onLocalUpdate && self.onLocalUpdate(obs);
                        };
                    })(observed);
                    observed.reader.readAsDataURL(observed.file);
                }
                observed.file.lastModifiedDate = +new Date
            })
        }, inter);
    };
    ShareArea.prototype.addFile = function (file) {
        var fileName = file.name,
            fileItem = createElement('li', {'class': 'file'}, fileName),
            closeIcon = createElement('span', {'class': 'close', title:'stop sharing that file'}, '&times;');
        fileItem.dataset.path = fileName;
        fileItem.dataset.observers = 0;
        fileItem.appendChild(closeIcon);
        this.sh_sharedFileList.push(fileName);
        this.fileList.appendChild(fileItem);
        this.onAdd && this.onAdd(file);
        return false;
    };
    ShareArea.prototype.removeFile = function (node) {
        var fileName = node.dataset.path
        this.fileList.removeChild(node)
        this.sh_sharedFileList = this.sh_sharedFileList.filter(function (f) {
            return f !== fileName
        });
        this.onRemove && this.onRemove(fileName);
    };
    ShareArea.prototype.render = function () {
        doRender.call(this);
    };
    
    /* ********************************************************************
     * 
     * 
     *
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
    ********************************************************************* */

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

        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });


    
})();
