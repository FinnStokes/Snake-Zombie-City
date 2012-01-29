var avatar = function (spec, my) {
    var that, player, velX, velY, facing, score;
    my = my || {};
    
    that = new Shape();
    player = spec.player;
    colour = spec.colour;
    velX = 0;
    velY = 0;
    facing = "right";
    score = 0;
    
    (function () {
        var s = that;
        var g = s.graphics;
        
        g.beginFill(colour).drawCircle(0, 0, 16);
    }());
    
    EVENT.subscribe(player+".move", function (e) {
        if (e.x !== 0 || e.y !== 0) {
            if (e.x > 0) {
                facing = "right";
            } else if (e.x < 0) {
                facing = "left";
            }
            if (e.y > 0) {
                facing = "down";
            } else if (e.y < 0) {
                facing = "up";
            }
        }
        
		velX = e.x * 8;
		velY = e.y * 8;
	});
    
    EVENT.subscribe(player+".shoot", function (e) {
        var velX = 0, velY = 0;
        if (facing === "right") {
            velX = 1;
        } else if (facing === "left") {
            velX = -1;
        } else if (facing === "down") {
            velY = 1;
        } else if (facing === "up") {
            velY = -1;
        }
        
		var b = bullet({x: that.x, y: that.y, velX: velX, velY: velY});
        camera.addChild(b);
	});
    
    that.addScore = function (value) {
        score += value;
    }
    
    that.getScore = function () {
        return score;
    }
    
    that.setScore = function (value) {
        score = value;
    }
	
	that.tick = function () {
		this.x += velX;
		this.y += velY;
		
		if (city.collidePoint(this.x, this.y)) {
			this.x -= velX;
			this.y -= velY;
		}
	};
    
    return that;
};
