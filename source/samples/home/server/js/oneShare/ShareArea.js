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
    this.dropArea.addEventListener('drop', this.handleFileDrop.bind(this), false);

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
 * the file has just been dropped and we just need to 
 * - quiet the dafault event handling/propagating
 * - alert the server a new file from this client is available to be shared
 * - save it among the locallyObserved ones so that at the watching loop we do not miss it
 */
ShareArea.prototype.handleFileDrop = function (evt) {
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
            obj = {
                file: file,
                name: file.name,
                date : file.lastModifiedDate,
                reader : reader,
                content : null
            };

        // eslint-disable-next-line no-loop-func
        reader.onload = (function() {
            return function(e) {
                // content is available now
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
        closeIcon = createElement('span', {
            'class': 'close',
            title:'stop sharing that file'
        }, '&times;');
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