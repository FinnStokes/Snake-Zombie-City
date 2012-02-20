var addRuleset = function (city) {
    city.addRule(popRule({
	'name': "transport",
	'city': city,
	'properties': ["transport"],
	'chance': 0.5,
	'radius': 1,
	'rate': function (mapProperties, properties, status, otherProperties, otherStatus) {
	    if (status.healthy < otherStatus.healthy && !status.infected) {
		return mapProperties.transportRate * (otherStatus.healthy - status.healthy);
	    } else {
		return 0;
	    }
	},
	'effect': function (mapProperties, properties, status, otherProperties, otherStatus) {
	    if (otherStatus.healthy >= 1 && (!properties.capacity || status.healthy <= properties.capacity-1)) {
		otherStatus.healthy--;
		status.healthy++;
	    }
	},
    }));
    city.addRule(popRule({
	'name': "snombie transport",
	'city': city,
	'properties': [],
	'chance': 0.5,
	'radius': 1,
	'rate': function (mapProperties, properties, status, otherProperties, otherStatus) {
	    if (status.healthy && status.infected < otherStatus.infected) {
		return mapProperties.snombieTransportRate * (otherStatus.infected - status.infected);
	    } else {
		return 0;
	    }
	},
	'effect': function (mapProperties, properties, status, otherProperties, otherStatus) {
	    if (otherStatus.infected >= 1) {
		otherStatus.infected--;
		status.infected++;
	    }
	},
    }));
    city.addRule(popRule({
	'name': "growth",
	'city': city,
	'properties': ["population"],
	'chance': 0.1,
	'radius': 0,
	'rate': function (mapProperties, properties, status) {
	    return properties.population;
	},
	'effect': function (mapProperties, properties, status) {
	    if (!properties.capacity || status.healthy <= properties.capacity-1) {
		status.healthy++;
	    }
	},
    }));
    city.addRule(popRule({
	'name': "spontaneous infect",
	'city': city,
	'properties': [],
	'chance': 0.001,
	'radius': 0,
	'rate': function (mapProperties, properties, status) {
	    return mapProperties.infectionRate * (status.healthy + 2*status.sick);
	},
	'effect': function (mapProperties, properties, status) {
	    if (Math.random()*(status.healthy + 2*status.sick) > status.healthy) {
		if (status.sick >= 1) {
		    status.sick--;
		    status.infected++;
		}
	    } else {
		if (status.healthy >= 1) {
		    status.healthy--;
		    status.infected++;
		}
	    }
	},
    }));
    city.addRule(popRule({
	'name': "contagious infect",
	'city': city,
	'properties': [],
	'chance': 0.005,
	'radius': 0,
	'rate': function (mapProperties, properties, status) {
	    return mapProperties.contagionRate * status.infected * (status.healthy + 2*status.sick);
	},
	'effect': function (mapProperties, properties, status) {
	    if (Math.random()*(status.healthy + 2*status.sick) > status.healthy) {
		if (status.sick >= 1) {
		    status.sick--;
		    status.infected++;
		}
	    } else {
		if (status.healthy >= 1) {
		    status.healthy--;
		    status.infected++;
		}
	    }
	},
    }));
};
/*
		rate = my.data.properties.infectionRate;
		infect(index, rate, elapsedTime, INFECTION_CHANCE, 'healthy');
		infect(index, rate*2, elapsedTime, INFECTION_CHANCE, 'sick');
		if (my.status[index].infected > 0) {
		    rate = my.data.properties.contagionRate;
		    infect(index, rate*my.status[index].infected, elapsedTime, CONTAGION_CHANCE, 'healthy');
		    infect(index, rate*2*my.status[index].infected, elapsedTime, CONTAGION_CHANCE, 'sick');
		}
*/