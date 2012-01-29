var canvas, stage, socket;

var camera, city, players, enemies;

jQuery(document).ready(function () {
    canvas = jQuery('#game').get(0);
    stage = new Stage(canvas);
    socket = io.connect('/rescue');
    
    camera = new Container();
    stage.addChild(camera);
    
    city = world({'socket': socket});
    city.load();
    camera.addChild(city);
    
    players = [];
    
    var p1 = avatar({player: "p1", colour: "#ff0000", x: 1, y: 1});
    players.push(p1);
    camera.addChild(p1);
    
    var p2 = avatar({player: "p2", colour: "#00ff00", x: 1, y: 1});
    players.push(p2);
    camera.addChild(p2);
    
    var p3 = avatar({player: "p3", colour: "#0000ff", x: 1, y: 1});
    players.push(p3);
    camera.addChild(p3);
    
    var p4 = avatar({player: "p4", colour: "#ffffff", x: 1, y: 1});
    players.push(p4);
    camera.addChild(p4);
    
    EVENT.subscribe("world.loaded", function () {
		// Spawn players
	    var spawn = city.getSpawn();
	    var spawnX = 192 * spawn.x;
	    var spawnY = 192 * spawn.y;
	    
	    p1.x = spawnX - 32;
	    p1.y = spawnY - 32;
	    
	    p2.x = spawnX - 32;
	    p2.y = spawnY + 32;
	    
	    p3.x = spawnX + 32;
	    p3.y = spawnY - 32;
	    
	    p4.x = spawnX + 32;
	    p4.y = spawnY + 32;
	    
	    
        enemies = [];
 
	    // Spawn enemies
		/*			console.log(city.width);
					console.log(city.height);
	    for (var x = 0; x < city.width; ++x) {
			for (var y = 0; y < city.height; ++y) {
				if (city.hasProperty(x, y, "snombie")) {
					console.log("add snombie");
					var e = enemy({type: "snombie"});
					enemies.push(e);
					e.x = 192 * x;
					e.y = 192 * y;
					camera.addChild(e);
				} else if (city.hasProperty(x, y, "civilian")) {
					console.log("add civilian");
					var e = enemy({type: "civilian"});
					enemies.push(e);
					e.x = 192 * x;
					e.y = 192 * y;
					camera.addChild(e);
				}
			}
		}*/
	});
	
	var scoreText = new Text("0", "32px sans-serif", "#ffffff");
	scoreText.x = 10;
	scoreText.y = 30;
    stage.addChild(scoreText);
    EVENT.subscribe("game.score", function (e) {
		scoreText.text = parseInt(scoreText.text) + e.score;
	});

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
		
		camera.x = (canvas.width / 2) - midX;
		camera.y = (canvas.height / 2) - midY;
		
        stage.update();
    };
    
    var resize = function () {
	    canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize, false);
    Ticker.setFPS(60);
    Ticker.addListener(update);
    resize();
});

