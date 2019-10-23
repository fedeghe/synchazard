function getFileDate(file) {
    return  file.lastModifiedDate ? 0+file.lastModifiedDate : file.lastModified ? 0+file.lastModified : 0
}

/* eslint-disable no-undef */
function ShareArea(trg) {
    this.target = trg;
    this.init();
    this.sh_sharedFileList = [];
    this.locallyObserved = [];
}

ShareArea.prototype.init = function () {
    var self = this;
    this.main = createElement('div', {'class' : 'shareArea'});
    this.dropArea = createElement('div', {'class' : 'shareAreaDrop'}, 'share a file by dragging it here');
    this.dropCryptArea = createElement('div', {'class' : 'shareAreaCryptDrop', 'title': 'password protected share'}, '🔑');
    this.fileList = createElement('ul', {'class' : 'shareAreaButtons'});
    this.detail = createElement('p', {'class' : 'shareAreaDetail'});
    
    this.fileList.addEventListener('click', function (e) {
        var trg = e.target,
            trgtag = trg.tagName;
        switch(trgtag) {
            case 'LI':
                trg.dataset.path.match(/\.bpmn$/)
                ? injectBPMN('modeler', function () {
                    self.modeler = new Modeler(self);
                    self.modeler.render(self.target);
                    self.BPMNgetMyContent(trg.dataset.path);
                })
                : injectBPMN(/* remove it */);
                break;
            case 'SPAN':
                    self.removeFile(trg.parentNode);
                break;
            default : break;
        }
    });
    this.fileList.addEventListener('mouseover', function (e) {
        var trg = e.target,
            trgtag = trg.tagName;
        if (trgtag === 'LI' && trg.dataset.pwd) {
            self.detail.innerHTML = 'Secured with: ' + trg.dataset.pwd
        }
    });
    this.fileList.addEventListener('mouseout', function (e) {
        var trg = e.target,
            trgtag = trg.tagName;
        if (trgtag === 'LI') {
            self.detail.innerHTML = '';
        }
    });

    this.dropArea.addEventListener('mouseout', this.handleMouseout.bind(this), false);
    this.dropArea.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
    this.dropCryptArea.addEventListener('dragover', this.handleDragOver.bind(this), false);
    this.dropArea.addEventListener('dragover', this.handleDragOver.bind(this), false);
    this.dropArea.addEventListener('drop', this.handleFileDrop.bind(this), false);
    
    this.dropArea.appendChild(this.dropCryptArea)    
    this.main.appendChild(this.dropArea)    
    this.main.appendChild(this.fileList)
    this.main.appendChild(this.detail)

    this.startWatching()
};

ShareArea.prototype.shareUpdatedModel = function(file, xml)  {
    this.BPMNupdateMyContent(file.filePath, xml);
};
ShareArea.prototype.handleMouseout = function (evt) {
    evt.target.classList.remove('mayDrop');
    evt.preventDefault();
    evt.stopPropagation();
}
ShareArea.prototype.handleDragLeave = function (evt) {
    evt.target.classList.remove('mayDrop');
    evt.preventDefault();
    evt.stopPropagation();
};
ShareArea.prototype.handleDragOver = function (evt) {
    evt.target.classList.add('mayDrop')
    evt.preventDefault();
    evt.stopPropagation();
};

/**
 * the file has just been dropped and we just need to 
 * - quiet the dafault event handling/propagating
 * - alert the server a new file from this client is available to be shared
 * - save it among the locallyObserved ones so that at the watching loop we do not miss it
 */
ShareArea.prototype.handleFileDrop = function (evt) {
    var trg = evt.target,
        needPwd = trg.classList.contains('shareAreaCryptDrop'),
        pwd = false,
        files = evt.dataTransfer.files,
        i = 0,
        len = 0,
        file,
        self = this;
    this.dropCryptArea.classList.remove('mayDrop');
    this.dropArea.classList.remove('mayDrop');
    evt.preventDefault();
    evt.stopPropagation();

    if (needPwd) {
        pwd = prompt('Provide a password') || false
    }

    // can handle more files in one drop
    for (i = 0, len = files.length; i < len; i++) {
        file = files[i]
        // eslint-disable-next-line one-var, vars-on-top
        var reader = new FileReader(),
            // eslint-disable-next-line no-unused-vars
            obj = {
                file: file,
                name: file.name,
                date : getFileDate(file),
                reader : reader,
                content : null
            };

        // eslint-disable-next-line no-loop-func
        reader.onload = (function(o) {
            return function(e) {
                // content is available now
                o.content =  e.target.result;
                self.addFile(o, pwd)
                self.locallyObserved.push(o);
            };
        })(obj);
        reader.readAsBinaryString(file);
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
                observed.reader.readAsBinaryString(observed.file);
            }
            observed.file.lastModifiedDate = +new Date
        })
    }, inter);
};

ShareArea.prototype.addFile = function (file, pwd) {
    var fileName = file.name,
        fileItem = createElement('li', {'class': 'file'}, fileName),
        closeIcon = createElement('span', {
            'class': 'close',
            title:'stop sharing that file'
        }, '&times;');
    fileItem.dataset.path = fileName;
    if(pwd) {
        fileItem.dataset.pwd = pwd;
        fileItem.classList.add('protected')
    }
    fileItem.dataset.observers = 0;
    fileItem.appendChild(closeIcon);
    this.sh_sharedFileList.push(fileName);
    this.fileList.appendChild(fileItem);
    this.onAdd && this.onAdd(file, pwd);
    return false;
};

ShareArea.prototype.removeFile = function (node) {
    var fileName = node.dataset.path;
    this.locallyObserved = this.locallyObserved.filter(function (lo) {
        return lo.name !== fileName;
    })
    this.fileList.removeChild(node);
    this.sh_sharedFileList = this.sh_sharedFileList.filter(function (f) {
        return f !== fileName;
    });
    this.onRemove && this.onRemove(fileName);
};

ShareArea.prototype.render = function () {
    doRender.call(this);
};