var fs = require('fs');

var cities = {};

var premade = {
    'infected': ['test.json'],
    'ruined': ['test.json'],
}

exports.random = function (type, done) {
    if (!cities[type]) {
        cities[type] = {'data': [], 'free': []};
    }

    if (cities[type].free.length > 0) {
        var id = cities[type].free.pop();
        done(cities[type].data[id]);
        return id;
    } else {
        exports.add(type, cities[type].data.length, done);
        cities[type].data.push(null);
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

exports.add = function(type, id, done) {
    filename = premade[type][Math.floor(Math.random()*premade[type].length)];
    
    fs.readFile(__dirname + "/" + filename, function (err, data) {
        if (!err) {
            cities[type].data[id] = JSON.parse(data);
            if(done) {
                done(cities[type].data[id]);
            }
        } else {
            console.log(err);
        }
    });
};
