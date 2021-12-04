function Modeler(parentInstance) {
    this.init();
    this.parentInstance = parentInstance;
}
Modeler.prototype.init = function() {
    var self = this;
    // eslint-disable-next-line no-undef
    this.wrap = createElement('div', {'class' : 'modelerWrapContainer'});
    this.wrap.style.display = 'relative';
    // eslint-disable-next-line no-undef
    this.container = createElement('div');
    // eslint-disable-next-line no-undef
    this.close = createElement('div', {'class' : 'modelerClose'});
    
    // eslint-disable-next-line no-undef
    this.modelerContainer = createElement('div', {'class' : 'modelerContainer'});
    this.close.addEventListener('click', function () {self.toggle(false)})
    // eslint-disable-next-line no-undef
    this.modeler = new BpmnJS({
        container: this.modelerContainer,
        keyboard: {
          bindTo: window
        }
      });
    this.modeler.on('commandStack.changed', this.onChange.bind(this));
};


Modeler.prototype.onChange = function() {
    var self = this;
    this.modeler.saveXML({ format: true }, function(err, xml) {
        console.log('change', +new Date)
        !err && self.parentInstance.shareUpdatedModel(self.file, xml);
    });
}
Modeler.prototype.render = function(target) {
    this.container.appendChild(this.close)
    this.container.appendChild(this.modelerContainer)
    this.wrap.appendChild(this.container)
    target.appendChild(this.wrap)
};
Modeler.prototype.setContent = function(file) {
    this.file = file;
    // eslint-disable-next-line no-unused-vars
    this.modeler.importXML(file.content, function(err) {});
};
Modeler.prototype.toggle = function(visible) {
    visible && this.modeler.clear();
    this.wrap.style.display = visible ? 'block' : 'none'
};
