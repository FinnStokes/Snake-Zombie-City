var avatar = function (spec, my) {
    var that, player, velX, velY;
    my = my || {};
    
    that = new Shape();
    player = spec.player;
    colour = spec.colour;
    velX = 0;
    velY = 0;
    
    (function () {
        var s = that;
        var g = s.graphics;
        
        g.beginFill(colour).drawCircle(0, 0, 16);
    }());
    
    EVENT.subscribe(player+".move", function (e) {
		velX = e.x * 10;
		velY = e.y * 10;
	});
	
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
