var NEW_ROAD_GID = 1;
var CROSSROAD_GID = 16;

var world = function (spec, my) {
    var that, tileset, tiles, overlay;
    my = my || {};
    
    that = new Container();
    overlay = new Container();
    overlay.visible = false;
    tileset = [];
    tiles = [];

    my.rules = [];
    my.status = [];
    
    var onLoaded;

    that.addRule = function(rule) {
	my.rules.push(rule);
    }

    that.load = function (callback) {
        onLoaded = callback;
        spec.socket.emit('getcity');
    };
    
    spec.socket.on('city', function (newCity) {
        if(!my.data && newCity) {
            my.data = newCity;
            load();
        }
    });

    that.toggleOverlay = function () {
	overlay.visible = ! overlay.visible;
	return overlay.visible;
    }
    
    that.upload = function () {
        spec.socket.emit('setcity', my.data);
	spec.reload();
        delete my.data;
        spec.socket.emit('getcity');
    };
    
    that.tileWidth = function () {
        if(my.data) {
            return my.data.tilesets[0].tilewidth;
        } else {
            return 0;
        }
    }
    
    that.tileHeight = function () {
        if(my.data) {
            return my.data.tilesets[0].tileheight;
        } else {
            return 0;
        }
    }

    that.width = function () {
        if(my.data) {
            return my.data.layers[0].width;
        } else {
            return 0;
        }
    }

    that.height = function () {
        if(my.data) {
            return my.data.layers[0].height;
        } else {
            return 0;
        }
    }

    that.left = function () {
        return -that.height() * that.tileWidth() / 2;
    }

    that.right = function () {
        return that.width() * that.tileWidth() / 2;
    }

    that.top = function () {
        return -that.tileHeight() / 2;
    }

    that.bottom = function () {
        return (that.height() + that.width() - 1) * that.tileHeight() / 2;
    }

    that.tileAt = function (x, y) {
        if (!my.data) {
            return {'x': 0, 'y': 0};
        }
        var pos = {};
        pos.x = Math.floor(y / my.data.tilesets[0].tileheight +
                           x / my.data.tilesets[0].tilewidth + 1/2);
        pos.y = Math.floor(y / my.data.tilesets[0].tileheight -
                           x / my.data.tilesets[0].tilewidth + 1/2);
        return pos;
    }

    that.hasProperty = function (x, y, property) {
        var index = x + (y * my.data.layers[0].width);
        var gid = my.data.layers[0].data[index];
        var tilesetId = gid < my.data.tilesets[2].firstgid ? 0 : 2;
        gid -= my.data.tilesets[tilesetId].firstgid;
        if(my.data.tilesets[tilesetId].tileproperties &&
           my.data.tilesets[tilesetId].tileproperties[gid] &&
           my.data.tilesets[tilesetId].tileproperties[gid][property]) {
            return true;
        }
        return false;
    }

    that.getProperty = function (x, y, property) {
        var index = x + (y * my.data.layers[0].width);
        var gid = my.data.layers[0].data[index];
        var tilesetId = gid < my.data.tilesets[2].firstgid ? 0 : 2;
        gid -= my.data.tilesets[tilesetId].firstgid;
        if(my.data.tilesets[tilesetId].tileproperties &&
           my.data.tilesets[tilesetId].tileproperties[gid]) {
            return my.data.tilesets[tilesetId].tileproperties[gid][property];
        }
        return null;
    }

    that.isRoad = function (x, y) {
	if (x < 0 || x >= that.width() || y < 0 || y >= that.height()) {
	    return false;
	}
	var index = x + (y * my.data.layers[0].width);
        var gid = my.data.layers[0].data[index];
        return gid >= NEW_ROAD_GID && gid <= CROSSROAD_GID;
    }

    var linkRoad = function (x, y, dir) {
	var index = x + (y * my.data.layers[0].width);
	var gid = my.data.layers[0].data[index] - 1;
        gid = gid | dir;
	my.data.layers[0].data[index] = gid + 1;
	tiles[index].gotoAndStop(gid);
    }

    that.setTile = function (x, y, gid) {
        if (gid == NEW_ROAD_GID) {
	    gid = 0;
	    if (that.isRoad(x-1, y)) {
		linkRoad(x-1, y, 2);
		gid = gid | 1;
	    }
	    if (that.isRoad(x+1, y)) {
		linkRoad(x+1, y, 1);
		gid = gid | 2;
	    }
	    if (that.isRoad(x, y-1)) {
		linkRoad(x, y-1, 8);
		gid = gid | 4;
	    }
	    if (that.isRoad(x, y+1)) {
		linkRoad(x, y+1, 4);
		gid = gid | 8;
	    }
	    gid += 1;
	}
        var index = x + (y * my.data.layers[0].width);
        my.data.layers[0].data[index] = gid;
        var tilesetId = gid < my.data.tilesets[2].firstgid ? 0 : 1;
        var offset = my.data.tilesets[tilesetId*2].firstgid;
        tiles[index].setTile(gid - offset, tileset[tilesetId], 
                             { 'x': my.data.tilesets[0].tilewidth/2,
                               'y': my.data.tilesets[tilesetId*2].tileheight - my.data.tilesets[0].tileheight/2,
                             });
    }

    that.getStatus = function (index) {
	return my.status[index];
    }

    that.getProperties = function (index) {
	if (index < 0 || index >= my.data.layers[0].data.length) {
	    return {};
	}
	
	var gid = my.data.layers[0].data[index];
        var tilesetId = gid < my.data.tilesets[2].firstgid ? 0 : 2;
        gid -= my.data.tilesets[tilesetId].firstgid;
        
	if (!my.data.tilesets[tilesetId].tileproperties ||
            !my.data.tilesets[tilesetId].tileproperties[gid]) {
	    return {};
	}
	
	var properties = my.data.tilesets[tilesetId].tileproperties[gid];

	/*if (properties.linked) {
	    var delX = properties.linked.x || 0;
	    var delY = properties.linked.y || 0;
	    return getProperties(x + delX, y + delY);
	}*/

	return properties;
    }

    that.tick = function () {
	var elapsedTime = spec.status.frameTime;
        for (var y = 0; y < my.data.layers[0].height; ++y) {
            for (var x = 0; x < my.data.layers[0].width; ++x) {
		var index = x + (y * my.data.layers[0].width);
		var properties = that.getProperties(index);
		var status = my.status[index];
		for (var i = 0; i < my.rules.length; i++) {
		    my.rules[i].eval(index,my.data.properties,spec.status,properties,status,elapsedTime);
		}
            }
        }
	spec.status.healthy = 0;
	spec.status.sick = 0;
	spec.status.infected = 0;
        for (var y = 0; y < my.data.layers[0].height; ++y) {
            for (var x = 0; x < my.data.layers[0].width; ++x) {
                var index = x + (y * my.data.layers[0].width);
		if (my.status[index]) {
		    spec.status.healthy += my.status[index].healthy;
		    spec.status.sick += my.status[index].sick;
		    spec.status.infected += my.status[index].infected;
		}
    }
	}
        if(spec.status.infected > spec.status.healthy) {
            that.upload();
        }
    }
    
    that.loaded = function () {
        if(my.data) {
            return true;
        } else {
            return false;
        }
    }
    
    that.getTileset = function (id) {
        if (my.data) {
            return tileset[id];
        } else {
            return null;
        }
    }

    that.getTilesetData = function (id) {
        if (my.data) {
            return my.data.tilesets[id];
        } else {
            return null;
        }
    }
    
    var render = function () {
        that.removeAllChildren();
	overlay.removeAllChildren();
        for (var y = 0; y < my.data.layers[0].height; ++y) {
            for (var x = 0; x < my.data.layers[0].width; ++x) {
                var index = x + (y * my.data.layers[0].width);
                var gid = my.data.layers[0].data[index];
                var tilesetId = gid < my.data.tilesets[2].firstgid ? 0 : 1;
                var offset = my.data.tilesets[tilesetId*2].firstgid;
                var newTile = tile({
                    'x': (x / 2 - y / 2) * my.data.tilesets[0].tilewidth,
                    'y': (x / 2 + y / 2) * my.data.tilesets[0].tileheight,
                    'id': gid - offset,
                    'tileset': tileset[tilesetId],
                    'offset': {
                        'x': my.data.tilesets[0].tilewidth/2,
                        'y': my.data.tilesets[tilesetId*2].tileheight - my.data.tilesets[0].tileheight/2,
                    },
                });
                tiles[index] = newTile;
                that.addChild(newTile);

		var newOverlay = overlayTile({
		    'x': (x / 2 - y / 2) * my.data.tilesets[0].tilewidth,
		    'y': (x / 2 + y / 2) * my.data.tilesets[0].tileheight,
		    'width': my.data.tilesets[0].tilewidth,
		    'height': my.data.tilesets[0].tileheight,
		    'status': my.status[index],
                });
                overlay.addChild(newOverlay);
            }
        }
	that.addChild(overlay);
    }

    var load = function () {
        if (my.data) {
	    my.rules = [];
	    my.status = [];
	    addRuleset(that);
	    for (var y = 0; y < my.data.layers[0].height; ++y) {
		for (var x = 0; x < my.data.layers[0].width; ++x) {
                    var index = x + (y * my.data.layers[0].width);
		    my.status[index] = {
			'healthy': 0,
			'sick': 0,
			'infected': 0,
		    };
		}
	    }

            var loaded = 2;
            
            var img1 = new Image();
            img1.src = "/"+my.data.tilesets[0].image;
            img1.onload = function () {
                tileset[0] = new SpriteSheet({
                    'images': [img1],
                    'frames': {
                        'width': my.data.tilesets[0].tilewidth,
                        'height': my.data.tilesets[0].tileheight,
                    },
                });
               --loaded;
                if (loaded == 0) {
                    render();
                    if (onLoaded) {
                        onLoaded();
                        onLoaded = null;
                    }
                }
            };
            
            var img2 = new Image();
            img2.src = "/"+my.data.tilesets[2].image;
            img2.onload = function () {
                tileset[1] = new SpriteSheet({
                    'images': [img2],
                    'frames': {
                        'width': my.data.tilesets[2].tilewidth,
                        'height': my.data.tilesets[2].tileheight,
                    },
                });
                --loaded; 
                if (loaded == 0) {
                    render();
                    if (onLoaded) {
                        onLoaded();
                        onLoaded = null;
                    }
                }
            };
        }
    }
    
    return that;
};
