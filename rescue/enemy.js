var enemy = function (spec, my) {
    var that, health;
    my = my || {};
    
    that = new Shape();
    health = 2;
    
    (function () {
        var s = that;
        var g = s.graphics;
        
        g.beginFill("#224466").drawCircle(0, 0, 8);
    }());
    
    EVENT.subscribe("enemy.hit", function (e) {
		if (e.enemy == that) {
			health -= e.damage;
			if (health <= 0) {
				stage.removeChild(that);
	            enemies.splice(enemies.indexOf(that), 1);
			}
		}
	});
	
	that.tick = function () {
		// Get the nearest player
		var maxDist = Number.MAX_VALUE, dist = Number.MAX_VALUE, idx = -1, dx, dy, n;
		for (var i = 0; i < players.length; ++i) {
			dist = Math.pow(players[i].x - this.x, 2) +
				Math.pow(players[i].y - this.y, 2)
			if (dist < maxDist) {
				maxDist = dist;
				idx = i;
			}
			if (idx == -1) {
				console.log(dist + " -- " + maxDist);
				console.log(players[i].x + ", " + players[i].y);
				console.log(this.x + ", " + this.y);
			}
		}
		
		// Move towards them
		dx = players[idx].x - this.x;
		dy = players[idx].y - this.y;
		n = Math.sqrt(dx * dx + dy * dy);		
		
		if (n != 0) {
			this.x += dx / n;
			this.y += dy / n;
		}
	};
    
    return that;
};
