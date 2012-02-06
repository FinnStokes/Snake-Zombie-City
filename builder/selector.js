var selector = function (spec, my) {
    var that, cursorX, cursorY;
    my = my || {};
    
    that = new Container();

    var building;

    var status = spec.status;

    that.alpha = spec.alpha || 0.5;
    that.buildings = spec.buildings || {};
    
    cursorX = 0;
    cursorY = 0;

    var city = spec.city;
    var pos;
    var loaded = true;

    var inBounds = function (checkPos) {
        if(!that.buildings) {
            return false;
        }
	    return checkPos && checkPos.x >= 0 && checkPos.y >= 0 && checkPos.x + that.buildings[building].width <= city.width() && checkPos.y + that.buildings[building].height <= city.height();
    }
    
    that.setBuilding = function (newBuilding) {
        building = newBuilding;
        loaded = false;
    }

    that.tick = function () {
        this.x = city.x + cursorX;
        this.y = city.y + cursorY;
        if (!loaded && that.buildings && city.loaded()) {
            that.removeAllChildren();
		    for (var x = 0; x < that.buildings[building].width; ++x) {
		        for (var y = 0; y < that.buildings[building].height; ++y) {
			        var gid = that.buildings[building].data[x + y * that.buildings[building].width];
                    var tilesetId = gid < city.getTilesetData(2).firstgid ? 0 : 1;
                    var offset = city.getTilesetData(tilesetId*2).firstgid;
                    var newTile = tile({
                        'x': (x / 2 - y / 2) * city.getTilesetData(0).tilewidth,
                        'y': (x / 2 + y / 2) * city.getTilesetData(0).tileheight,
                        'id': gid - offset,
                        'tileset': city.getTileset(tilesetId),
                        'offset': {
                            'x': city.getTilesetData(0).tilewidth/2,
                            'y': city.getTilesetData(tilesetId*2).tileheight - city.getTilesetData(0).tileheight/2,
                        },
                    });
                    that.addChild(newTile);
		        }
            }
		}
		loaded = true;
    };

    that.setBuilding(0);

    that.moveTo = function (newPos) {
        if(inBounds(newPos) && city.loaded()) {
	        pos = newPos;
            cursorX = (pos.x - pos.y) * city.tileWidth() / 2;
            cursorY = (pos.x + pos.y) * city.tileHeight() / 2;
        }
    }
    
    that.place = function () {
	    if (inBounds(pos)) {
            if (status.money < that.buildings[building].cost) {
                return false;
            }
            
	        clear = true;
	        for (var x = 0; x < that.buildings[building].width; ++x) {
		        for (var y = 0; y < that.buildings[building].height; ++y) {
		            if (!city.hasProperty(pos.x + x, pos.y + y, 'buildable')) {
			            clear = false;
			            break;
		            }
		        }
	        }

	        if (clear) {
		        for (var x = 0; x < that.buildings[building].width; ++x) {
		            for (var y = 0; y < that.buildings[building].height; ++y) {
			            city.setTile(pos.x + x, pos.y + y, that.buildings[building].data[x + y * that.buildings[building].width]);
		            }
		        }
                status.money -= that.buildings[building].cost;
                return true;
	        } else {
                return false;
            }
	    }
    }
    
    that.hide = function () {
    }
    
    return that;
};
