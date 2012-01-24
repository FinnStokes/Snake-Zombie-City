var world = function (spec, my) {
    var that, tileset, tiles;
    my = my || {};
    
    that = new Container();
    tileset = [];
    tiles = [];
    
    that.load = function () {
        spec.socket.emit('getcity');
    };
    
    spec.socket.on('city', function (newCity) {
        if(!my.data) {
            my.data = newCity;
            load();
        }
    });
    
    that.upload = function () {
        spec.socket.emit('setcity', my.data);
        delete my.data;
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

    that.setTile = function (x, y, id) {
        var index = x + (y * my.data.layers[0].width);
        my.data.layers[0].data[index] = id;
        tiles[index].spriteSheet;
    }
    
    var render = function () {
        that.removeAllChildren();
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
            }
        }
    }

    var load = function () {
        if (my.data) {
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
                }
            };
        }
    }
    
    return that;
};
