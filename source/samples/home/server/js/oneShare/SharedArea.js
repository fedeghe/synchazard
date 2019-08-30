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

SharedArea.prototype.addFile = function(file, user){
    // add the tabtongue && activate content && disable from the select
    var content = `... loading content for ... ${file}`;
    this.addTab(file, user)
    this.tabContentTextarea.innerHTML = content;
    this.tabContent.classList.remove('hide')
};

SharedArea.prototype.addTab = function(file, user){

    var tab = createElement('li', {'class': 'tabTongue active', title: `${file}_${user}`}, file),
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
    this.onRemove && this.onRemove(tag)
};

SharedArea.prototype.activateTab = function(tag){
    this.activeTab.classList.remove('active')
    this.activeTab = tag;
    tag.classList.add('active');
};

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

SharedArea.prototype.addSharedFile = function (data) {
    this.filePoolSelect.addFile(data.name, data.uid);
};

SharedArea.prototype.removeSharedFile = function (data) {
    this.filePoolSelect.removeFile(data.name, data.uid);
};

SharedArea.prototype.updateSharedFiles = function (files) {
    this.filePoolSelect.update(files);
};