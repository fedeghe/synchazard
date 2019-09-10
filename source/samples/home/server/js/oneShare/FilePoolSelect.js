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
        var trg = e.target,
            opt = trg.options[trg.selectedIndex],
            file = opt.dataset.file,
            user = opt.dataset.user;
        
        self.parentInstance.addFile(file, user)
        self.disableFile(file, user)
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
        this.optGroups[user] = createElement('optGroup', {label: `user: ${user}`});
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
    newOption = createElement('option', {value: ''}, file);
    newOption.dataset.user = user;
    newOption.dataset.file = file;
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
            if (child.dataset.user === user && child.dataset.file === file) {
                self.optGroups[user].removeChild(child)
            }
        })
        if (this.optGroups[user].children.length === 0) {
            this.main.removeChild(this.optGroups[user])
            delete(this.optGroups[user])
        }

        this.firstOption.innerHTML = this.fileCount > 0
        ? `${this.fileCount} files shared (select one or more)`
        : 'no files available'
    }
};

FilePoolSelect.prototype.disableFile = function (file, user) {
    this.optGroups[user] && Array.from(this.optGroups[user].children).forEach(function (child) {
        if (child.dataset.user === user && child.dataset.file === file) {
            child.setAttribute('disabled', 'disabled')
        }
    })
};

FilePoolSelect.prototype.enableFile = function (file, user) {
    this.optGroups[user] && Array.from(this.optGroups[user].children).forEach(function (child) {
        if (child.dataset.user === user && child.dataset.file === file) {
            child.removeAttribute('disabled')
        }
    })
};

FilePoolSelect.prototype.removeAll = function () {
    this.main.innerHTML = ''
    this.firstOption.innerHTML = 'no files available'
    this.main.appendChild(this.firstOption)
    this.fileCount = 0
    this.optGroups = {}
    this.userFiles = {}
};

FilePoolSelect.prototype.update = function (files) {
    var self = this;
    this.removeAll();

    Object.keys(files)
    .filter(function (userId) {return userId !== SH.id} ) 
    .forEach(function (userId) {
        files[userId].forEach( function (f) {
            self.addFile(f.filePath, userId)
        });
    });
};

FilePoolSelect.prototype.render = function () {
    doRender.call(this);
};
