var world = function (spec, my) {
    var that, tileset;
    my = my || {};
    
    that = new Container();
    tileset = [];
    
    that.width = 0;
    that.height = 0;
    
    that.load = function () {
        spec.socket.emit('getcity');
    };
    
    spec.socket.on('city', function (newCity) {
        if(!my.data) {
            my.data = newCity;
            load();
            that.width = my.data.layers[0].width;
            that.height = my.data.layers[0].height;
            EVENT.notify("world.loaded",{});
        }
    });
    
    that.upload = function () {
        spec.socket.emit('setcity', my.data);
        delete my.data;
    };
    
    that.collidePoint = function (x, y) {
        var tile = that.tileAt(x, y);
        if (tile) {
            return that.hasProperty(tile.x, tile.y, "solid");
        }
    }

    that.getSpawn = function () {
        if (my.data === undefined) {
            return null;
        }
        for (var x = 0; x < my.data.layers[0].width; ++x) {
            for (var y = 0; y < my.data.layers[0].height; ++y) {
                if (that.hasProperty(x, y, "spawn")) { 
                    return {x: x, y: y};
                }
            }
        }
    }

    that.hasProperty = function (x, y, property) {
        var index = x + (y * my.data.layers[0].width);
        var gid = my.data.layers[0].data[index];
        var tilesetId = gid < my.data.tilesets[2].firstgid ? 1 : 3;
        gid -= my.data.tilesets[tilesetId-1].firstgid;
        if (my.data.tilesets[tilesetId].tileproperties &&
                my.data.tilesets[tilesetId].tileproperties[gid] &&
                my.data.tilesets[tilesetId].tileproperties[gid][property]) {
            return true;
        }
        return false;
    }

    that.tileAt = function (x, y) {
        var pos = {};
        if (my.data === undefined) {
            return null;
        }
        tileX = Math.floor(x / my.data.tilesets[1].tilewidth + 1/2);
        tileY = Math.floor(y / my.data.tilesets[1].tileheight + 1/2);
        if(tileX < 0 || tileY < 0 ||
           tileX > my.data.layers[0].width ||
           tileY > my.data.layers[0].height) {
            return null;
        }
        return {'x': tileX, 'y': tileY,
                'width': my.data.tilesets[1].tilewidth,
                'height': my.data.tilesets[1].tileheight,
               };
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
                    'x': x * my.data.tilesets[1].tilewidth,
                    'y': y * my.data.tilesets[1].tileheight,
                    'id': gid - offset,
                    'tileset': tileset[tilesetId],
                    'offset': {
                        'x': my.data.tilesets[1].tilewidth/2,
                        'y': my.data.tilesets[tilesetId*2 + 1].tileheight - my.data.tilesets[1].tileheight/2,
                    },
                });
                that.addChild(newTile);
            }
        }
    }
    
    var load = function () {
        if (my.data) {
            var loaded = 2;
            
            var img1 = new Image();
            img1.src = "/"+my.data.tilesets[1].image;
            img1.onload = function () {
                tileset[0] = new SpriteSheet({
                    'images': [img1],
                    'frames': {
                        'width': my.data.tilesets[1].tilewidth,
                        'height': my.data.tilesets[1].tileheight,
                    },
                });
               --loaded;
                if (loaded == 0) {
                    render();
                }
            };
            
            var img2 = new Image();
            img2.src = "/"+my.data.tilesets[3].image;
            img2.onload = function () {
                tileset[1] = new SpriteSheet({
                    'images': [img2],
                    'frames': {
                        'width': my.data.tilesets[3].tilewidth,
                        'height': my.data.tilesets[3].tileheight,
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
