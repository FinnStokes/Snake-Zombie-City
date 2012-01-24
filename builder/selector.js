var selector = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Container();
    that.visible = false;

    var buildings = spec.buildings;
    var building;

    var status = spec.status;

    that.alpha = spec.alpha || 0.5;

    var city = spec.city;
    var pos;

    var inBounds = function (checkPos) {
	return checkPos && checkPos.x >= 0 && checkPos.y >= 0 && checkPos.x + buildings[building].width <= city.width() && checkPos.y + buildings[building].height <= city.height();
    }
    
    that.setBuilding = function (newBuilding) {
        building = newBuilding;

        if (city.loaded()) {
            that.removeAllChildren();
		    for (var x = 0; x < buildings[building].width; ++x) {
		        for (var y = 0; y < buildings[building].height; ++y) {
			        var gid = buildings[building].data[x + y * buildings[building].width];
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
    };

    that.setBuilding(0);

    that.moveTo = function (newPos) {
        if(inBounds(newPos)) {
	    pos = newPos;
            that.x = (pos.x - pos.y) * city.tileWidth() / 2;
            that.y = (pos.x + pos.y) * city.tileHeight() / 2;
            that.visible = true;
        }
    }
    
    that.place = function () {
	    if (inBounds(pos)) {
            if (status.money < buildings[building].cost) {
                return false;
            }
            
	        clear = true;
	        for (var x = 0; x < buildings[building].width; ++x) {
		        for (var y = 0; y < buildings[building].height; ++y) {
		            if (!city.hasProperty(pos.x + x, pos.y + y, 'buildable')) {
			            clear = false;
			            break;
		            }
		        }
	        }

	        if (clear) {
		        for (var x = 0; x < buildings[building].width; ++x) {
		            for (var y = 0; y < buildings[building].height; ++y) {
			            city.setTile(pos.x + x, pos.y + y, buildings[building].data[x + y * buildings[building].width]);
		            }
		        }
                status.money -= buildings[building].cost;
                return true;
	        } else {
                return false;
            }
	    }
    }
    
    that.hide = function () {
        that.visible = false;
    }
    
    return that;
};