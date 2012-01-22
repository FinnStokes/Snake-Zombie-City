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
            that.removeAllChildren();
            for (var x = 0; x < my.data.layers[0].width; ++x) {
                for (var y = 0; y < my.data.layers[0].height; ++y) {
                    var newTile = tile({'x': x, 'y': y});
                    that.addChild(newTile);
                }
            }
        }
    }
    
    return that;
};