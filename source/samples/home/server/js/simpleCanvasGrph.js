(function () {
    "use strict"; 
    function onresize(instance) {
        window.addEventListener('resize', function() {
            instance.w = document.body.clientWidth;
            instance.canvas.setAttribute('width', instance.w);
        })
    }
    function Grp(w, h) {
        this.w = w || document.body.clientWidth;
        this.h = h || 100;
        this.points = [];
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = 'transparent';
        this.canvas.style.margin = '0px';
        this.canvas.style.padding = '0px';
        this.canvas.style.border = 'none';
        this.canvas.style.height = this.h + 'px';
        this.init();
        if (!w && !h) onresize(this);
    }

    Grp.prototype.init = function () {
        this.canvas.setAttribute('width', this.w);
        this.canvas.setAttribute('height', this.h);
        this.ctx = this.canvas.getContext('2d');
    };

    Grp.prototype.render = function (trg) {
        trg.innerHTML = '';
        trg.appendChild(this.canvas);
        return this;
    };

    Grp.prototype.addPoint = function (v) {
        var n = 100,
            i = 0, l;
        
        this.points.push(v);
        
        if (this.points.length > n) {
            this.points = this.points.reverse().slice(0, n).reverse();
        }
        l = this.points.length;

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.lineWidth = 0.5;

        this.ctx.beginPath();
        this.ctx.fillStyle = '#000';
        
        this.ctx.moveTo(this.w, 100);
        if (l < n) this.ctx.lineTo(~~((l-1) * this.w / n), 100);
        for (i = l - 1; i > 0 ; i--) {
            this.ctx.lineTo(~~(i * this.w / n), ~~(this.points[i]));
            this.ctx.lineTo(~~((i-1) * this.w / n), ~~(this.points[i-1]));
        }
        this.ctx.lineTo(0, 100);
        this.ctx.closePath();
        this.ctx.fill();
    };


    window.Scg = {
        create : function (w, h) {
            return new Grp(w, h);
        }
    };
})();