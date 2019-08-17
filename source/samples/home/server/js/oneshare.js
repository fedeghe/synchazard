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
        this.fileList.addEventListener('click', function (e) {
            var trg = e.target,
                trgtag = trg.tagName;
            if (trgtag === 'SPAN') {
                self.fileList.removeChild(trg.parentNode)
            }
        })

        this.main.appendChild(this.dropArea)    
        this.main.appendChild(this.fileList)
    };
    ShareArea.prototype.addFile = function (filename) {
        var fileItem = createElement('li', {'class': 'file'}, filename),
            closeIcon = createElement('span', {'class': 'close'}, '&times;');

        fileItem.appendChild(closeIcon);
        this.sharedFileList.push(filename);
        this.fileList.appendChild(fileItem);
    };    
    ShareArea.prototype.render = function () {
        doRender.call(this);
    };




    function SharedArea(trg) {
        this.target = trg;
        this.init();
    }
    SharedArea.prototype.init = function  () {
        var self = this;
        this.main = createElement('div', {'class' : 'sharedArea'});

        this.fileSelector = new FilePoolSelect(this.main, this);
        this.fileSelector.render()

        this.tabList = createElement('ul', {'class' : 'tabList'});
        this.tabs = [];
        this.tabContent = createElement('div', {'class' : 'tabContent hide'});
        this.tabContentTextarea = createElement('textarea', {'class' : 'content'});
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
        console.log('add file tab', file)
        this.addTab(file)
        console.log('request content')
        var content = `the content is ${file}`;
        this.tabContentTextarea.innerHTML = content;
        this.tabContent.classList.remove('hide')
        console.log('activate content')
    };
    SharedArea.prototype.deactiveAll = function(){
        this.tabs.forEach(function (tab){
            tab.classList.remove('active')
        })
    };  
    SharedArea.prototype.addTab = function(filen){
        this.tabs.forEach(function (tab){
            tab.classList.remove('active')
        })
        var split = filen.split('___'),
            user = split[0],
            file = split[1],
            tab = createElement('li', {'class': 'tabTongue active', title: filen}, file),
            close = createElement('span', {'class':'close'}, '&times;')
        this.tabs.push(tab);
        tab.appendChild(close)
        this.tabList.appendChild(tab)
    };
    SharedArea.prototype.removeTab = function(tag){
        var removingActive = tag.classList.contains('active'),
            t = tag.title.split('___').reverse();

        this.tabs = this.tabs.filter(function (tab) {return tab.title !== tag.title});
        this.fileSelector.enableFile(t[0], t[1])
        
        if (this.tabs.length === 0) {
            this.tabContent.classList.add('hide')
        } else if (removingActive) {
            this.tabs[0].click();
        }
        this.tabList.removeChild(tag)
    };
    SharedArea.prototype.selectTab = function(tag){
        this.deactiveAll();
        tag.classList.add('active');
        this.setContent(tag.title);
    };
    SharedArea.prototype.render = function  () {
        doRender.call(this);
    };
    SharedArea.prototype.setContent = function (cnt) {
        this.tabContentTextarea.innerHTML = cnt;
    };

    function FilePoolSelect(trg, parentInstance) {
        this.parentInstance = parentInstance;
        this.target = trg;
        this.optGroups = {}
        this.userFiles = {}
        this.init();
    }
    FilePoolSelect.prototype.render = function () {
        doRender.call(this);
    };
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

    window.addEventListener('load', function () {
        var target = document.getElementById('target'),
            shareArea = new ShareArea(target),
            sharedArea = new SharedArea(target);
        shareArea.render();
        sharedArea.render();
        window.shareArea = shareArea;
        window.sharedArea = sharedArea;
        window.filePoolSelect = sharedArea.fileSelector;


filePoolSelect.addFile('aaa.js', 'Federico')
filePoolSelect.addFile('bbb.js', 'Federico')
filePoolSelect.addFile('ccc.js', 'Federico')
filePoolSelect.addFile('aaa.js', 'Gabri')
filePoolSelect.addFile('bbb.js', 'Gabri')
        

        maltaV('NS').utils.loadScript('/js/handlers/oneshare.js');
    });
})();
