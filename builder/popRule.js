var popRule = function (spec, my) {
    var that;
    my = my || {};
    
    that = {};

    var city = spec.city;
    var requiredProps = spec.properties || [];
    var getRate = spec.rate || function () { return 0; };
    var chance = spec.chance || 0.5;
    var effect = spec.effect || function () {};
    var timer = [];

    if (spec.radius) {
	var offsets = [];
	for (var r = 1; r <= spec.radius; r++) {
	    for (var s = 0; s < r; s++) {
		offsets.push((r-s) + s*city.width());
		offsets.push((s-r) - s*city.width());
		offsets.push( s + (s-r)*city.width());
		offsets.push(-s + (r-s)*city.width());
	    }
	}
	console.log(offsets);
    }

    that.eval = function (index, mapProperties, properties, status, time) {
	for (var i = 0; i < requiredProps.length; i++) {
	    if (!properties[requiredProps[i]]) {
		return;
	    }
	}

	if (!offsets) {
	    if (!timer[index]) {
		timer[index] = 0;
	    }

	    var rate = getRate(mapProperties, properties, status);
	    timer[index] += rate*time;

	    while (timer[index] > chance)  {
		timer[index] -= chance;
		if(Math.random() < chance) {
		    effect(mapProperties, properties, status);
		}
	    }
	} else {
	    for (var j = 0; j < offsets.length; j++) {
		var other = index + offsets[j];
		otherProperties = city.getProperties(other);
		otherStatus = city.getStatus(other);
		if  (!otherStatus) {
		    continue;
		}

		if (!timer[index]) {
		    timer[index] = [];
		}

		// Replace other with j?
		if (!timer[index][other]) {
		    timer[index][other] = 0;
		}
		
		var rate = getRate(mapProperties, properties, status, otherProperties, otherStatus);
		timer[index][other] += rate*time;
		
		while (timer[index][other] > chance)  {
		    timer[index][other] -= chance;
		    if(Math.random() < chance) {
			effect(mapProperties, properties, status, otherProperties, otherStatus);
		    }
		}
	    }
	}
    }

    return that;
};