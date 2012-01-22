var cities = {};

exports.random = function (type) {
    if (!cities[type]) {
        cities[type] = {'data': [], 'free': []};
    }

    if (cities[type].free.length > 0) {
        return cities[type].free.pop();
    } else {
        var newCity = exports.create({'seed': Math.random()});
        cities[type].data.push(newCity);
        return cities[type].data.length - 1;
    }
};

exports.get = function(type, id) {
    if (cities[type]) {
        return cities[type].data[id];
    } else {
        return null;
    }
};

exports.free = function(type, id) {
    if (cities[type] && cities[type].data[id]) {
        cities[type].free.push(id);
    }
};

exports.add = function(type, city) {
    if (!cities[type]) {
        cities[type] = {'data': [], 'free': []};
    }

    cities[type].data.push(city);

    return true;
};

exports.remove = function(type, id) {
    if (cities[type] && cities[type].data[id]) {
        delete cities[type].data[id];
    }
};

exports.create = function(spec,my) {
    var that;
    my = my || {};
    spec = spec || {};

    that = { "height":10,
             "layers":[
                 {
                     "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     "height":10,
                     "name":"Tile Layer 1",
                     "opacity":1,
                     "type":"tilelayer",
                     "visible":true,
                     "width":10,
                     "x":0,
                     "y":0
                 }],
             "orientation":"isometric",
             "properties":
             {

             },
             "tileheight":32,
             "tilesets":[],
             "tilewidth":32,
             "version":1,
             "width":10
           };

    that.seed = spec.seed || 0;

    return that;
};