var bullet = function (spec, my) {
    var that, velX, velY, owner;
    my = my || {};
    
    that = new Shape();
    velX = spec.velX;
    velY = spec.velY;
    owner = spec.owner;
    
    that.x = spec.x;
    that.y = spec.y;
    
    (function () {
        var s = that;
        var g = s.graphics;
        
        g.beginFill("#ff9911").drawCircle(0, 0, 2);
    }());
	
    that.tick = function () {
        var speed = 30;
        
        for (var i = 0; i < enemies.length; ++i) {
            var mx = this.x + velX * speed / 2;
            var my = this.y + velY * speed / 2;
            var d = Math.pow(enemies[i].x - mx, 2) +
                Math.pow(enemies[i].y - my, 2);
            if (d <= Math.pow(speed, 2)) {
                EVENT.notify("enemy.hit", {enemy: enemies[i], damage: 1, player: owner});
                //XXX: Ugly hack to avoid EaselJS erroring on removal of
                // multiple bullets per frame.
                break;
            }
        }
        
		this.x += velX * speed;
		this.y += velY * speed;
	};
    
    return that;
};
