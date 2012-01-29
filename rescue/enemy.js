var enemy = function (spec, my) {
    var that, type, subType, health, heading, speed, turnSpeed, player;
    my = my || {};
    
    that = new Container();
    type = spec.type;
    subType = spec.subType || Math.floor(Math.random()*4);
    health = 2;
    heading = 0;
    if (type === "snombie") {
		speed = 1.3;
	    turnSpeed = 0.5;
	} else if (type === "civilian") {
		speed = 0.7;
		turnSpeed = 1;
	}
	player = null;
    
    var sprite;
    that.render = function () {
		var frame = subType;
        if (type === "civilian") {
			frame += 4;
		}
        sprite.gotoAndStop(frame);
    };
    
    var img = new Image();
    img.onload = function () {
		var sheet = new SpriteSheet({
            'images': [img],
            'frames': {
				'width': 40,
				'height': 83,
				'regX': 20,
				'regY': 41,
			},
		});
		sprite = new BitmapAnimation(sheet);
		that.addChild(sprite);
		that.render();
	}
	img.src = "/rescue/img/enemies.png";
    
    EVENT.subscribe("enemy.hit", function (e) {
		if (e.enemy == that) {
			health -= e.damage;
			if (health <= 0) {
				if (type === "snombie") {
					EVENT.notify("game.score", {score: 5, player: e.player});
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
		EVENT.notify("game.score", {score: -10, player: 0});
		EVENT.notify("game.score", {score: -10, player: 1});
		EVENT.notify("game.score", {score: -10, player: 2});
		EVENT.notify("game.score", {score: -10, player: 3});
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
				EVENT.notify("game.score", {score: 100, player: player});
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
		// set owner as nearest player
		player = idx;
		
		// Hurt them
		if (minDist < 32 * 32 && type === "snombie") {
			EVENT.notify("game.score", {score: -100, player: idx});
			EVENT.notify("enemy.kill", {enemy: this});
			return;
		}
		// Move towards them
		if (minDist < 256 * 256) {
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
		if (minDist < 256 * 256) {
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
