var canvas, stage, socket;

var city, players, enemies;

jQuery(document).ready(function () {
    canvas = jQuery('#game').get(0);
    stage = new Stage(canvas);
    socket = io.connect('/rescue');
    
    city = world({'socket': socket});
    city.load();
    stage.addChild(city);
    
    players = [];
    
    var p1 = avatar({player: "p1", colour: "#ff0000", x: 100, y: 100});
    players.push(p1);
    stage.addChild(p1);
    
    var p2 = avatar({player: "p2", colour: "#00ff00", x: 100, y: 100});
    players.push(p2);
    stage.addChild(p2);
    
    var p3 = avatar({player: "p3", colour: "#0000ff", x: 100, y: 100});
    players.push(p3);
    stage.addChild(p3);
    
    var p4 = avatar({player: "p4", colour: "#ffffff", x: 100, y: 100});
    players.push(p4);
    stage.addChild(p4);
    
    enemies = [];
    
    for (var i = 0; i < 100; ++i) {
		var e = enemy({type: "snombie"});
		enemies.push(e);
		e.x = i * 40;
		stage.addChild(e);
	}
	
	for (var i = 0; i < 100; ++i) {
		var e = enemy({type: "civilian"});
		enemies.push(e);
		e.x = i * 40;
		e.y = 400;
		stage.addChild(e);
	}

    var update = {};
    update.tick = function () {
		// Update camera
		var midX = 0, midY = 0;
		var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
		var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
		for (var i = 0; i < players.length; ++i) {
			if (players[i].x < minX) {
				minX = players[i].x;
			}
			if (players[i].y < minY) {
				minY = players[i].y;
			}
			if (players[i].x > maxX) {
				maxX = players[i].x;
			}
			if (players[i].y > maxY) {
				maxY = players[i].y;
			}
		}
		midX = (minX + maxX) / 2;
		midY = (minY + maxY) / 2;
		/*for (var i = 0; i < players.length; ++i) {
			midX += players[i].x;
			midY += players[i].y;
		}
		midX /= players.length;
		midY /= players.length;*/
		
		stage.x = (canvas.width / 2) - midX;
		stage.y = (canvas.height / 2) - midY;
		
        stage.update();
    };
    window.addEventListener('resize', resize, false);
    Ticker.setFPS(60);
    Ticker.addListener(update);
    resize();
    
    function resize() {
	    canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
});

