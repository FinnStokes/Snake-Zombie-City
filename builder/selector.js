var selector = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Shape();
    that.visible = false;

    var buildings = spec.buildings;
    var building = 3;

    that.alpha = spec.alpha || 0.5;

    that.graphics.beginFill(spec.colour);
    that.graphics.moveTo(-buildings[building].width * 0.5, (buildings[building].height - 1) * 0.5);
    that.graphics.lineTo(0,-0.5);
    that.graphics.lineTo(buildings[building].width * 0.5, (buildings[building].height - 1) * 0.5);
    that.graphics.lineTo(0,buildings[building].height - 0.5);
    that.graphics.closePath();
    that.graphics.endFill();

    var city = spec.city;
    var pos;

    var inBounds = function (checkPos) {
	return checkPos && checkPos.x >= 0 && checkPos.y >= 0 && checkPos.x + buildings[building].width <= city.width() && checkPos.y + buildings[building].height <= city.height();
    }

    that.moveTo = function (newPos) {
        if(inBounds(newPos)) {
	    pos = newPos;
            that.x = (pos.x - pos.y) * city.tileWidth() / 2;
            that.y = (pos.x + pos.y) * city.tileHeight() / 2;
            that.scaleX = city.tileWidth();
            that.scaleY = city.tileHeight();
            that.visible = true;
        }
    }
    
    that.place = function () {
	    if(inBounds(pos)) {
	        clear = true;
	        for (var x = 0; x < buildings[building].width; ++x) {
		        for (var y = 0; y < buildings[building].height; ++y) {
		            if (!city.hasProperty(pos.x + x, pos.y + y, 'buildable')) {
			            clear = false;
			            break;
		            }
		        }
	        }
            console.log(clear);
	        if (clear) {
		        for (var x = 0; x < buildings[building].width; ++x) {
		            for (var y = 0; y < buildings[building].height; ++y) {
			            city.setTile(pos.x + x, pos.y + y, buildings[building].data[x + y * buildings[building].width]);
		            }
		        }
	        }
	    }
    }
    
    that.hide = function () {
        that.visible = false;
    }
    
    return that;
};