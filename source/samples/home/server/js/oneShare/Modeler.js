function Modeler(parentInstance) {
    this.init();
    this.parentInstance = parentInstance;
}
Modeler.prototype.init = function() {
    var self = this;
    this.wrap = createElement('div', {'class' : 'modelerWrapContainer'});
    this.wrap.style.display = 'relative';
    this.container = createElement('div');
    this.close = createElement('div', {'class' : 'modelerClose'});
    
    this.modelerContainer = createElement('div', {'class' : 'modelerContainer'});
    this.close.addEventListener('click', function () {self.toggle(false)})
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
    this.modeler.importXML(file.content, function(err) {});
};
Modeler.prototype.toggle = function(visible) {
    this.wrap.style.display = visible ? 'block' : 'none'
};
