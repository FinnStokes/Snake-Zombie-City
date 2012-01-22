var world = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Container();
    
    that.load = function () {
        spec.socket.emit('getcity');
    };
    
    spec.socket.on('city', function (newCity) {
        if(!my.data) {
            my.data = newCity;
            render();
        }
    });
    
    that.upload = function () {
        spec.socket.emit('setcity', my.data);
        delete my.data;
    };

    that.tileAt = function (x, y) {
        var pos = {};
        tileX = Math.floor(y / my.data.tilesets[0].tileheight +
                           x / my.data.tilesets[0].tilewidth + 1/2);
        tileY = Math.floor(y / my.data.tilesets[0].tileheight -
                           x / my.data.tilesets[0].tilewidth + 1/2);
        if(tileX < 0 || tileY < 0 ||
           tileX > my.data.layers[0].width ||
           tileY > my.data.layers[0].height) {
            return null;
        }
        return {'x': tileX, 'y': tileY,
                'width': my.data.tilesets[0].tilewidth,
                'height': my.data.tilesets[0].tileheight,
               };
    }
    
    var render = function () {
        if (my.data) {
            var img = new Image();
            img.src = "/"+my.data.tilesets[0].image;
            img.onload = function () {
                var tileset = new SpriteSheet({
                    'images': [img],
                    'frames': {
                        'width': my.data.tilesets[0].tilewidth,
                        'height': my.data.tilesets[0].tileheight,
                    },
                });
            
                that.removeAllChildren();
                for (var y = 0; y < my.data.layers[0].height; ++y) {
                    for (var x = 0; x < my.data.layers[0].width; ++x) {
                        var index = x + (y * my.data.layers[0].width);
                        var newTile = tile({
                            'x': (x / 2 - y / 2) * my.data.tilesets[0].tilewidth,
                            'y': (x / 2 + y / 2) * my.data.tilesets[0].tileheight,
                            'id': my.data.layers[0].data[index] - my.data.tilesets[0].firstgid,
                            'tileset': tileset,
                            'offset': {
                                'x': my.data.tilesets[0].tilewidth/2,
                                'y': my.data.tilesets[0].tileheight/2,
                            },
                        });
                        that.addChild(newTile);
                    }
                }
            };
        }
    }
    
    return that;
};