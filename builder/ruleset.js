var addRuleset = function (city) {
    city.addRule(popRule({
	'name': "transport",
	'city': city,
	'properties': ["transport"],
	'chance': 0.5,
	'radius': 1,
	'rate': function (globalProperties, globalStatus, properties, status, otherProperties, otherStatus) {
	    if (status.healthy < otherStatus.healthy && !status.infected) {
		return globalProperties.transportRate * (otherStatus.healthy - status.healthy);
	    } else {
		return 0;
	    }
	},
	'effect': function (globalProperties, globalStatus, properties, status, otherProperties, otherStatus) {
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
	'rate': function (globalProperties, globalStatus, properties, status, otherProperties, otherStatus) {
	    if (status.healthy && status.infected < otherStatus.infected) {
		return globalProperties.snombieTransportRate * (otherStatus.infected - status.infected);
	    } else {
		return 0;
	    }
	},
	'effect': function (globalProperties, globalStatus, properties, status, otherProperties, otherStatus) {
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
	'rate': function (globalProperties, globalStatus, properties, status) {
	    return properties.population;
	},
	'effect': function (globalProperties, globalStatus, properties, status) {
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
	'rate': function (globalProperties, globalStatus, properties, status) {
	    return globalProperties.infectionRate * (status.healthy + 2*status.sick);
	},
	'effect': function (globalProperties, globalStatus, properties, status) {
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
	'rate': function (globalProperties, globalStatus, properties, status) {
	    return globalProperties.contagionRate * status.infected * (status.healthy + 2*status.sick);
	},
	'effect': function (globalProperties, globalStatus, properties, status) {
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
	'name': "tax",
	'city': city,
	'properties': [],
	'chance': 1,
	'radius': 0,
	'rate': function (globalProperties, globalStatus, properties, status) {
	    return 1;
	},
	'effect': function (globalProperties, globalStatus, properties, status) {
            if(status.healthy) {
                globalStatus.money += status.healthy*globalProperties.taxRate;
            }
	},
    }));
};