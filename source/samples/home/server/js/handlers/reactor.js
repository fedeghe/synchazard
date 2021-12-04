(function () {
    

    var EXCEPTIONS = {
        DATA_REACTOR: 'No data-reactor attribute found'
    };

    /**
     * Reaction class
     * 
     * @param {*} node 
     */
    function Reaction(node) {
        this.isReady = false;
        this.node = node;
        this._is_disabled = false;
        this.id = node.dataset.reactor || false;
        if (this.id === null) {
            throw EXCEPTIONS.DATA_REACTOR;
        }
        this.init();
    }

    Reaction.prototype.handledNodes = {
        INPUTtext: {
            start: function () {
                var self = this;
                self.val = self.node.value;
                //                      or 'input'
                self.node.addEventListener('focus', function () {
                    if (self.node.value === self.val) {
                        self.enable();
                        return;
                    }
                    if (self._is_disabled) return;
                    if (self.node.value !== self.val){
                        self.disable();
                    }
                });
                self.node.addEventListener('blur', function () {
                    if (self._is_disabled) {
                        self.enable();
                    }
                });
            }, 
            startLate: function () {
                var self = this;
                self.val = self.node.value;
                self.node.addEventListener('focus', function () {
                    self.node.value = '';
                });
                self.node.addEventListener('blur', function () {
                    self.enable();
                });
            }, 
            disable: function () {
                this._is_disabled = true;
                maltaV('NS').send({
                    _ACTION: 'disable',
                    _NODEID: this.id
                });
            }, 
            enable: function () {
                this._is_disabled = false;
                maltaV('NS').send({
                    _ACTION: 'enable',
                    _VALUE: this.node.value,
                    _NODEID: this.id
                });
            },
            doDisable : function(v) {
                this.node.value = v;
                this.node.disabled = true;
            },
            doEnable: function (v) {
                this.node.value = v;
                this.node.disabled = false;
            }
        },
        TEXTAREA: {
            start: function () {
                var self = this;
                self.val = self.node.value;
                self.node.addEventListener('input', function () {
                    if (self.node.value === self.val) {
                        self.enable();
                        return;
                    }
                    if (self._is_disabled) return;
                    if (self.node.value !== self.val) {
                        self.disable();
                    }
                });
                self.node.addEventListener('blur', function () {
                    if (self._is_disabled) {
                        self.enable();
                    }
                });
            },
            startLate: function () {
                var self = this;
                self.val = self.node.value;
                self.node.addEventListener('focus', function () {
                    self.node.value = '';
                });
                self.node.addEventListener('blur', function () {
                    self.enable();
                });
            },
            disable: function () {
                this._is_disabled = true;
                maltaV('NS').send({
                    _ACTION: 'disable',
                    _NODEID: this.id
                });
            },
            enable: function () {
                this._is_disabled = false;
                maltaV('NS').send({
                    _ACTION: 'enable',
                    _VALUE: this.node.value,
                    _NODEID: this.id
                });
            },
            doDisable: function (v) {
                this.node.value = v;
                this.node.disabled = true;
            },
            doEnable: function (v) {
                this.node.value = v;
                this.node.disabled = false;
            }
        }
    };

    Reaction.prototype.init = function () {
        var idn = this.node.tagName + (this.node.tagName === "INPUT" ? this.node.type : "");
        if (idn in this.handledNodes) {
            this.start = this.handledNodes[idn].start.bind(this);
            this.startLate = this.handledNodes[idn].startLate.bind(this);
            this.disable = this.handledNodes[idn].disable.bind(this);
            this.enable = this.handledNodes[idn].enable.bind(this);
            this.doDisable = this.handledNodes[idn].doDisable.bind(this);
            this.doEnable = this.handledNodes[idn].doEnable.bind(this);
            this.start();
            // this.startLate();
        }
        return this;
    };

    /**
     * Reactor class
     * 
     */
    function Reactor(conf) {
        this.conf = conf || {};
        this.elements = [];
    }
    Reactor.prototype.ready = function () {
        this.isReady = true;
    };

    // handling function 
    //
    Reactor.prototype.handle = function (d) {
        var self = this,
            initStatus,
            i, l;
        /**
         * could happen that on the client side the elements has not yet been added,
         * but the init function has already give back his result... in this case nothing would happen
         * 
         * looks like this is working, must inverstigate a bit deeper
         */
        if (!this.isReady) {
            setTimeout(function () {self.handle(d);}, 100);
            return;
        }

        switch(d._ACTION) {
            case 'reactor_updateInitStatus': 
                initStatus = d._NODE_LIST;
                for (i = 0, l = this.elements.length; i < l; i++) {

                    if (this.elements[i].id in initStatus) {
                        if (initStatus[this.elements[i].id].gotToken === false) {
                            this.elements[i].doEnable(initStatus[this.elements[i].id].value);
                        } else if (
                            initStatus[this.elements[i].id].gotToken &&
                            initStatus[this.elements[i].id].gotToken !== maltaV('NS').id
                        ) {
                            this.elements[i].doDisable(initStatus[this.elements[i].id].value);
                        }
                    } else {
                        /**
                         * reset at init if not found for example the server
                         * restarts (all values are gone)
                         */
                        this.elements[i].doEnable('');
                    }
                }   
                break;
            case 'reactor_enableAll': 
                this.elements.forEach(function (element) {
                    if (
                        d._ID !== maltaV('NS').id &&
                        d._NODEID === element.node.dataset.reactor
                    ) element.doEnable(d._VALUE);
                });
                break;
            case 'reactor_disableAll':
                this.elements.forEach(function (element) {
                    d._ID !== maltaV('NS').id &&
                    d._NODEID === element.node.dataset.reactor &&
                    element.doDisable(d._VALUE);
                });
                break;
            default: break;
        }
    };

    Reactor.prototype.add = function (el) {
        this.elements.push(new Reaction(el));
        return this;
    };

    /**
     * scan the dom activating reactor on all
     * elements that has a data-reactor
     */
    Reactor.prototype.scan = function () {
        var self = this,
            els = document.querySelectorAll('[data-reactor]');
        [].forEach.call(els, function (el) {
            self.elements.push(new Reaction(el));
        });
        return this;
    };

    Reactor.prototype.auto = function () {
        this.scan().ready();
    };
    
    maltaV('NS').handlers.Reactor = new Reactor();
})();



