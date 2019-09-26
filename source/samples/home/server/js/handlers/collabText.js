(function () {
    

    function Collab() {
        this.nodes = {};
    }
    
    // eslint-disable-next-line complexity
    Collab.prototype.handle = function (d) {
        var i = null;
        if (d._TYPE !== 'action') return;
        switch (d._ACTION) {
            case 'enableAll':
                if (d._ID !== maltaV('NS').id) {
                    this.nodes[d._NODEID].removeAttribute('disabled');
                    this.nodes[d._NODEID].value = d._VALUE;
                }
                break;
            case 'disableAll':
                if (d._ID !== maltaV('NS').id) {
                    this.nodes[d._NODEID].setAttribute('disabled', 'disabled');
                }
                break;
            case 'updateInitStatus': 
                for (i in this.nodes){
                    if (i in d._NODE_LIST) {
                        this.nodes[i].value = d._NODE_LIST[i].value || '';

                        if ('sizes' in d._NODE_LIST[i]) {
                            this.nodes[i].style.width = d._NODE_LIST[i].sizes[0] + 'px';
                            this.nodes[i].style.height = d._NODE_LIST[i].sizes[1] + 'px';
                        }
                    }
                }
                break;
            case 'resize':
                if (d._ID !== maltaV('NS').id) {
                    this.nodes[d._NODEID].style.width = d._SIZES[0] + 'px';
                    this.nodes[d._NODEID].style.height = d._SIZES[1] + 'px';
                }
                break;
            default: break;
        }
        
    };

    Collab.prototype.add = function (node) {
        var id = node.id,
            to = setTimeout(function () {}, Infinity),
            sizes = [0, 0];
        
        if (id in this.nodes) {
            console.log('Node already added');
            return this;
        }
        
        this.nodes[id] = node;

        function updateAll() {
            maltaV('NS').send({
                _ACTION: 'enable',
                _VALUE: node.value,
                _NODEID: id
            });
        }

        node.addEventListener('input', function (/* e */) {
            clearTimeout(to);
            maltaV('NS').send({
                _ACTION: 'disable',
                _NODEID: id
            });
            to = setTimeout(function () {
                updateAll();
            }, 0);
        });
        node.addEventListener('blur', updateAll);

        // resize textarea
        node.addEventListener('mouseup', function (/* e */) {
            var w = node.clientWidth,
                h = node.clientHeight;
            if (w !== sizes[0] || h !== sizes[1]){
                sizes[0] = w;
                sizes[1] = h;
                maltaV('NS').send({
                    _ACTION: 'resize',
                    _NODEID: id,
                    _SIZES: [w, h]
                });
            }
        });
    };

    maltaV('NS').handlers.Collab = new Collab();
})();



