function SharedArea(trg) {
    this.target = trg;
    this.activeTab = null;
    this.init();
}

SharedArea.prototype.init = function  () {
    var self = this;
    // eslint-disable-next-line no-undef
    this.main = createElement('div', {'class' : 'sharedArea'});

    // eslint-disable-next-line no-undef
    this.filePoolSelect = new FilePoolSelect(this.main, this);
    this.filePoolSelect.render()

    // eslint-disable-next-line no-undef
    this.tabList = createElement('ul', {'class' : 'tabList'});
    this.tabs = [];
    // eslint-disable-next-line no-undef
    this.tabContent = createElement('div', {'class' : 'tabContent hide'});
    // eslint-disable-next-line no-undef
    this.tabContentTextarea = createElement('textarea', {'class' : 'content'});
    // eslint-disable-next-line no-undef
    this.xeditor = createElement('div', {'class' : 'xeditor'});
    
    // eslint-disable-next-line no-undef
    this.panel = createElement('div', {'class' : 'contentPanel'});
    this.tabContent.appendChild(this.panel)
    this.tabContent.appendChild(this.tabContentTextarea)
    this.tabContent.appendChild(this.xeditor)
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
    });
    // eslint-disable-next-line no-undef
    injectBPMN('viewer', function () {
        // eslint-disable-next-line no-undef
        self.viewer = new BpmnJS({
            container: self.xeditor
        });
    });
    
};

SharedArea.prototype.addFile = function(file, user){
    // add the tabtongue && activate content && disable from the select
    var content = '... loading content for ... ' + file;
    this.addTab(file, user)
    this.tabContentTextarea.innerHTML = content;
    this.tabContent.classList.remove('hide')
};

SharedArea.prototype.addTab = function(file, user){
    // eslint-disable-next-line no-undef
    var tab = createElement('li', {'class': 'tabTongue active', title: file + '_' + user}, file),
        // eslint-disable-next-line no-undef
        close = createElement('span', {'class':'close'}, '&times;');
    this.activeTab && this.activeTab.classList.remove('active')
    this.tabs.push(tab);
    tab.dataset.user = user; 
    tab.dataset.file = file; 
    tab.appendChild(close)
    this.tabList.appendChild(tab)
    this.activeTab = tab
    this.onAdd && this.onAdd(file, user)
};

SharedArea.prototype.removeTab = function(tag){
    var removingActive = tag.classList.contains('active'),
        user = tag.dataset.user,
        file = tag.dataset.file;

    this.tabs = this.tabs.filter(function (tab) {return tab.title !== tag.title});
    this.filePoolSelect.enableFile(file, user)
    
    if (this.tabs.length === 0) {
        this.tabContent.classList.add('hide')
    } else if (removingActive) {
        this.tabs[0].click();
    }
    this.tabList.removeChild(tag)
    this.onRemove && this.onRemove(file, user)
};

SharedArea.prototype.activateTab = function(tag){
    this.activeTab.classList.remove('active')
    this.activeTab = tag;
    tag.classList.add('active');
};

SharedArea.prototype.selectTab = function(tag){
    this.activateTab(tag);
    this.onSelectTab && this.onSelectTab(tag.dataset.file, tag.dataset.user)
    this.setContent(tag.title);
};

SharedArea.prototype.showContent = function () {
    this.tabContentTextarea.style.display = 'block';
    this.xeditor.style.display = 'none';
}
SharedArea.prototype.showXeditor = function () {
    this.tabContentTextarea.style.display = 'none';
    this.xeditor.style.display = 'block';
}
SharedArea.prototype.setContent = function (cnt, filePath) {
    if (!filePath || this.activeTab.dataset.file === filePath) {
        if (filePath && filePath.match(/\.bpmn$/)) {
            this.showXeditor();
            this.viewer.importXML(cnt, function(err) {
                if (err) {
                    console.log('error rendering', err);
                } else {
                    console.log('rendered');
                }
            });
        } else {
            this.showContent();
            this.tabContentTextarea.innerHTML =  cnt;
        }
    }
};

SharedArea.prototype.render = function  () {
    // eslint-disable-next-line no-undef
    doRender.call(this);
};

SharedArea.prototype.addSharedFile = function (data) {
    this.filePoolSelect.addFile(data.name, data.uid, data.pwd);
};

SharedArea.prototype.removeSharedFile = function (data) {
    var tag2Remove = this.tabs.find(function(t){ return t.dataset.file === data.name})
    tag2Remove && this.removeTab(tag2Remove)
    this.filePoolSelect.removeFile(data.name, data.uid);
};

SharedArea.prototype.updateSharedFiles = function (files) {
    this.filePoolSelect.update(files);
};