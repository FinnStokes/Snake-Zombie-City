var tile = function (spec, my) {
    var that;
    my = my || {};
    
    that = new BitmapAnimation(spec.tileset);
    that.gotoAndStop(spec.id);

    if (spec.offset) {
        that.regX = spec.offset.x;
        that.regY = spec.offset.y;
    }

    that.x = spec.x || 0;
    that.y = spec.y || 0;

    that.setTile = function (id, tileset, offset) {
        this.spriteSheet = tileset;
        this.gotoAndStop(id)
        this.regX = offset.x;
        this.regY = offset.y;
    };
    
    return that;
};

var POP_UNIT = 10;

var overlayTile = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Shape();

    that.x = spec.x || 0;
    that.y = spec.y || 0;

    that.scaleX = spec.width;
    that.scaleY = spec.height;

    that.alpha = 0.4;

    var oldHealthy;
    var oldSick;
    var oldInfected;

    that.tick = function () {
	if (spec.status.healthy != oldHealthy ||
	    spec.status.healthy != oldHealthy ||
	    spec.status.healthy != oldHealthy) {
	    that.graphics.clear();
	    
	    oldHealthy = spec.status.healthy;
	    oldSick = spec.status.sick;
	    oldInfected = spec.status.infected;
	    
	    var r = Math.pow(0.5,Math.floor(spec.status.infected/POP_UNIT));
	    r = Math.floor(((1 - r) + r*0.5*(spec.status.infected%POP_UNIT)/POP_UNIT)*255);
	    var g = Math.pow(0.5,Math.floor(spec.status.healthy/POP_UNIT));
	    g = Math.floor(((1 - g) + g*0.5*(spec.status.healthy%POP_UNIT)/POP_UNIT)*255);
	    var b = Math.pow(0.5,Math.floor(spec.status.sick/POP_UNIT));
	    b = Math.floor(((1 - b) + b*0.5*(spec.status.sick%POP_UNIT)/POP_UNIT)*255);

	    /*var next = 0.5;
	    var tmp = spec.status.healthy;
	    var g = 0;
	    while(tmp > POP_UNIT) {
		g += next;
		next *= 0.5;
		tmp -= POP_UNIT;
	    }
	    g += (tmp/POP_UNIT) * next;
	    g = Math.floor(g*255);*/
	    //console.log(spec.status.healthy + " => " + g);
	    
	    //that.graphics.setStrokeStyle(0.1);
	    //that.graphics.beginStroke(Graphics.getRGB(0,0,0));
	    that.graphics.beginFill(Graphics.getRGB(r,g,b));
	    that.graphics.moveTo(-0.5,0);
	    that.graphics.lineTo(0,-0.5);
	    that.graphics.lineTo(0.5,0);
	    that.graphics.lineTo(0,0.5);
	    that.graphics.closePath();
	    that.graphics.endFill();
	    //that.graphics.endStroke();
	}
    }
    
    return that;
};
