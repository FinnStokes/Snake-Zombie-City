var canvas, stage, socket;
var splash, splashTime;
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
    
    var p1 = avatar({player: "p1", colour: "#ff0000", x: 1, y: 1, playerNum: 0});
    players.push(p1);
    camera.addChild(p1);
    
    var p2 = avatar({player: "p2", colour: "#00ff00", x: 1, y: 1, playerNum: 1});
    players.push(p2);
    camera.addChild(p2);
    
    var p3 = avatar({player: "p3", colour: "#0000ff", x: 1, y: 1, playerNum: 2});
    players.push(p3);
    camera.addChild(p3);
    
    var p4 = avatar({player: "p4", colour: "#ffffff", x: 1, y: 1, playerNum: 3});
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
	    for (var x = 0; x < city.width; ++x) {
			for (var y = 0; y < city.height; ++y) {
				if (city.hasProperty(x, y, "snombie")) {
					var e = enemy({type: "snombie"});
					enemies.push(e);
					e.x = 192 * x;
					e.y = 192 * y;
					camera.addChild(e);
				} else if (city.hasProperty(x, y, "civilian")) {
					var e = enemy({type: "civilian"});
					enemies.push(e);
					e.x = 192 * x - 32;
					e.y = 192 * y - 32;
					camera.addChild(e);

					var e = enemy({type: "civilian"});
					enemies.push(e);
					e.x = 192 * x - 32;
					e.y = 192 * y + 32;
					camera.addChild(e);
					
					var e = enemy({type: "civilian"});
					enemies.push(e);
					e.x = 192 * x + 32;
					e.y = 192 * y - 32;
					camera.addChild(e);

					var e = enemy({type: "civilian"});
					enemies.push(e);
					e.x = 192 * x + 32;
					e.y = 192 * y + 32;
					camera.addChild(e);
				}
			}
		}
	});
	
	var score = [];
	score[0] = new Text("0", "32px sans-serif", "#ffffff");
	score[0].x = 10;
	score[0].y = 30;
    stage.addChild(score[0]);
    
    score[1] = new Text("0", "32px sans-serif", "#ffffff");
	score[1].x = window.innerWidth - 120;
	score[1].y = 30;
    stage.addChild(score[1]);
    
    score[2] = new Text("0", "32px sans-serif", "#ffffff");
	score[2].x = 10;
	score[2].y = window.innerHeight - 10;
    stage.addChild(score[2]);
    
    score[3] = new Text("0", "32px sans-serif", "#ffffff");
	score[3].x = window.innerWidth - 120;
	score[3].y = window.innerHeight - 10;
    stage.addChild(score[3]);
    
    splash = new Container();
    bg = new Shape();
    bg.graphics.beginFill('black').drawRect(0, 0, window.innerWidth, window.innerHeight);
    splash.addChild(bg);
    bmp = new Bitmap("/rescue/img/splash.png");
    bmp.x = (window.innerWidth - 1024) / 2;
    splash.addChild(bmp);
    stage.addChild(splash);
    splashTime = 40;
    
    EVENT.subscribe("game.score", function (e) {
		console.log(e.player);
		if (e.player !== undefined) {
			players[e.player].addScore(e.score);
			score[e.player].text = players[e.player].getScore();
		}
	});

    var update = {};
    update.tick = function () {
        if (splashTime > 0) {
            --splashTime;
            if (splashTime == 0) {
                stage.removeChild(splash);
            }
        }
        
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

