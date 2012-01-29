var enemy = function (spec, my) {
    var that, type, health, heading, speed, turnSpeed;
    my = my || {};
    
    that = new Shape();
    type = spec.type;
    health = 2;
    heading = 0;
    if (type === "snombie") {
		speed = 1.3;
	    turnSpeed = 0.5;
	} else if (type === "civilian") {
		speed = 0.7;
		turnSpeed = 1;
	}
    
    that.render = function () {
        var s = that;
        var g = s.graphics;
        
        g.clear();
        if (type === "snombie") {
			g.beginFill("purple");
		} else if (type === "civilian") {
			g.beginFill("green");
		}
        g.drawCircle(0, 0, 8);
    };
    that.render();
    
    EVENT.subscribe("enemy.hit", function (e) {
		if (e.enemy == that) {
			health -= e.damage;
			if (health <= 0) {
				if (type === "snombie") {
					EVENT.notify("game.score", {score: 5});
				}
				camera.removeChild(that);
	            enemies.splice(enemies.indexOf(that), 1);
			}
		}
	});
	
	EVENT.subscribe("enemy.kill", function (e) {
		if (e.enemy == that) {
			camera.removeChild(that);
	        enemies.splice(enemies.indexOf(that), 1);
		}
	});
	
	that.infect = function () {
		type = "snombie";
		this.render();
		EVENT.notify("game.score", {score: -10});
	}
	
	that.isCivilian = function () {
		return type === "civilian";
	}
	
	that.isSnombie = function () {
		return type === "snombie";
	}
	
	that.tick = function () {
		var velX = 0, velY = 0;
		
		// Rescue civilians
		if (type === "civilian") {
			var tile = city.tileAt(this.x, this.y);
			if (tile && city.hasProperty(tile.x, tile.y, "safe")) {
				EVENT.notify("enemy.kill", {enemy: this});
				EVENT.notify("game.score", {score: 100});
			}
		}
		
		// Get the nearest player
		var minDist = Number.MAX_VALUE, dist = Number.MAX_VALUE, idx = -1, dx, dy, n;
		for (var i = 0; i < players.length; ++i) {
			dist = Math.pow(players[i].x - this.x, 2) +
				Math.pow(players[i].y - this.y, 2);
			if (dist < minDist) {
				minDist = dist;
				idx = i;
			}
		}
		
		// Move towards them
		if (minDist < 192 * 192) {
			dx = players[idx].x - this.x;
			dy = players[idx].y - this.y;
			n = Math.sqrt(dx * dx + dy * dy);		
			
			if (n != 0) {
				velX = dx / n;
				velY = dy / n;
			}
		}
		
		// Snombie/civilian interactions
		minDist = Number.MAX_VALUE, dist = Number.MAX_VALUE, idx = -1, dx, dy, n;
		for (var i = 0; i < enemies.length; ++i) {
			dist = Math.pow(enemies[i].x - this.x, 2) +
				Math.pow(enemies[i].y - this.y, 2);
			if (type === "snombie") {
				if (enemies[i].isCivilian()) {
					if (dist < 16 * 16) {
						enemies[i].infect();
					} else {
						if (dist < minDist) {
							minDist = dist;
							idx = i;
						}
					}
				}
			} else if (type === "civilian") {
				if (enemies[i].isSnombie()) {
					if (dist < minDist) {
						minDist = dist;
						idx = i;
					}
				}
			}
		}
		if (minDist < 192 * 192) {
			dx = enemies[idx].x - this.x;
			dy = enemies[idx].y - this.y;
			n = Math.sqrt(dx * dx + dy * dy);		
			
			if (n != 0) {
				velX = dx / n;
				velY = dy / n;
			}
			
			if (type === "civilian") {
				velX = -velX;
				velY = -velY;
			}
		}
		if (type === "snombie" && velX === 0 && velY === 0) {
			heading += (Math.random() * 2 - 1) * turnSpeed;
			velX = Math.cos(heading);
			velY = Math.sin(heading);
		}
		
		var newX = this.x + velX * speed;
		var newY = this.y + velY * speed;
		if (city.collidePoint(newX, newY)) {
			heading += Math.PI;
		} else {
			this.x = newX;
			this.y = newY;
		}
	};
    
    return that;
};
