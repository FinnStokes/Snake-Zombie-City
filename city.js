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
	
	that = {};

	that.seed = spec.seed || 0;

	return that;
};
