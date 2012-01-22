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
                        });
                        that.addChild(newTile);
                    }
                }
            };
        }
    }
    
    return that;
};