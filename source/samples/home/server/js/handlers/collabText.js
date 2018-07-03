(function () {
    "use strict";

    function Collab() {
        this.nodes = {};
    }
    
    Collab.prototype.handle = function (d) {
        var i = null;
        if (d._TYPE !== 'action') return;
        switch (d._ACTION) {
            case 'enableAll':
                if (d._ID !== $NS$.id) {
                    this.nodes[d._NODEID].removeAttribute('disabled');
                    this.nodes[d._NODEID].value = d._VALUE;
                }
                break;
            case 'disableAll':
                if (d._ID !== $NS$.id) {
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
                if (d._ID !== $NS$.id) {
                    this.nodes[d._NODEID].style.width = d._SIZES[0] + 'px';
                    this.nodes[d._NODEID].style.height = d._SIZES[1] + 'px';
                }
                break;
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
            $NS$.send({
                _TYPE: 'action',
                _ACTION: 'enable',
                _VALUE: node.value,
                _NODEID: id
            });
        }

        node.addEventListener('input', function (e) {
            clearTimeout(to);
            $NS$.send({
                _TYPE: 'action',
                _ACTION: 'disable',
                _NODEID: id
            });
            to = setTimeout(function () {
                updateAll();
            }, 0);
        });
        node.addEventListener('blur', updateAll);

        // resize textarea
        node.addEventListener('mouseup', function (e) {
            var w = node.clientWidth,
                h = node.clientHeight;
            if (w !== sizes[0] || h !== sizes[1]){
                sizes[0] = w;
                sizes[1] = h;
                $NS$.send({
                    _TYPE: 'action',
                    _ACTION: 'resize',
                    _NODEID: id,
                    _SIZES: [w, h]
                });
            }
        });
    };

    $NS$.handlers.Collab = new Collab();
})();



