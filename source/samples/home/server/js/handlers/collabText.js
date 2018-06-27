(function () {
    "use strict";

    function Collab() {
        this.nodes = {};
    }
    
    Collab.prototype.handle = function (d) {
        var i = null;
        if (d.___TYPE !== 'action') return;
        switch (d.___ACTION) {
            case 'enableAll':
                if (d.___ID !== $NS$.id) {
                    this.nodes[d.___NODEID].removeAttribute('disabled');
                    this.nodes[d.___NODEID].value = d.___VALUE;
                }
                break;
            case 'disableAll':
                if (d.___ID !== $NS$.id) {
                    this.nodes[d.___NODEID].setAttribute('disabled', 'disabled');
                }
                break;
            case 'updateInitStatus': 
                for (i in this.nodes){
                    if (i in d.___NODE_LIST) {
                        this.nodes[i].value = d.___NODE_LIST[i].value || '';

                        if ('sizes' in d.___NODE_LIST[i]) {
                            this.nodes[i].style.width = d.___NODE_LIST[i].sizes[0] + 'px';
                            this.nodes[i].style.height = d.___NODE_LIST[i].sizes[1] + 'px';
                        }
                    }
                }
                break;
            case 'resize':
                if (d.___ID !== $NS$.id) {
                    this.nodes[d.___NODEID].style.width = d.___SIZES[0] + 'px';
                    this.nodes[d.___NODEID].style.height = d.___SIZES[1] + 'px';
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
                ___TYPE: 'action',
                ___ACTION: 'enable',
                ___VALUE: node.value,
                ___NODEID: id
            });
        }

        node.addEventListener('input', function (e) {
            clearTimeout(to);
            $NS$.send({
                ___TYPE: 'action',
                ___ACTION: 'disable',
                ___NODEID: id
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
                    ___TYPE: 'action',
                    ___ACTION: 'resize',
                    ___NODEID: id,
                    ___SIZES: [w, h]
                });
            }
        });
    };

    $NS$.handlers.Collab = new Collab();
})();



