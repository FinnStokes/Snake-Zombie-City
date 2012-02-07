var statusDisplay = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Container();

    that.x = spec.x || 0;
    that.y = spec.y || 0;

    that.money = spec.money || 0;
    that.population = spec.population || 0;
    that.sick = spec.sick || 0;
    that.infected = spec.infected || 0;
    
    var containers = [];
    var text = [];

    for (var i = 0; i < 4; i++) {
	containers[i] = new Container();
	containers[i].x = 8;
	containers[i].y = 32 + i*50;
	text[i] = new Text("0", "32px sans-serif", "#ffffff");
	text[i].x = 32;
	text[i].y = 0;
	containers[i].addChild(text[i]);
	that.addChild(containers[i]);
    }

    var loaded = false;
    that.loaded = function () {
	return loaded;
    }

    that.load = function (callback) {
	var img = new Image();
	img.src = spec.img;
	img.onload = function () {
	    var spriteSheet = new SpriteSheet({
		'images': [img],
		'frames': {
		    'width': 32,
		    'height': 32,
		    'regX': 0,
		    'regY': 26,
		},
	    });
	    
	    for (var i = 0; i < containers.length; i++) {
		var sprite = new BitmapAnimation(spriteSheet);
		sprite.gotoAndStop(i);
		containers[i].addChild(sprite);
	    }

	    loaded = true;
	    
	    callback();
	};
    }

    that.tick = function () {
        text[0].text = "" + Math.floor(that.money);
        text[1].text = "" + Math.floor(that.population);
        text[2].text = "" + Math.floor(that.sick);
        text[3].text = "" + Math.floor(that.infected);
    }
    
    return that;
}