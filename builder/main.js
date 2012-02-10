var KEYCODE_0 = 48;
var KEYCODE_1 = 49;
var KEYCODE_2 = 50;
var KEYCODE_3 = 51;
var KEYCODE_4 = 52;
var KEYCODE_5 = 53;
var KEYCODE_6 = 54;
var KEYCODE_7 = 55;
var KEYCODE_8 = 56;
var KEYCODE_9 = 57;
var KEYCODE_P = 80;

jQuery(document).ready(function () {
    var canvas = jQuery('#game').get(0);
    var stage = new Stage(canvas);
    var socket = io.connect('/builder');
    var res = resourceManager({'img': '/builder/img/splash.png'});
    
    canvas.width = 800;
    canvas.height = 600;

    stage.addChild(res);

    var load = function () {
	stage.removeAllChildren();
	stage.addChild(res);
        stage.onMouseDown = null;
        document.onkeyup = null;
	update.tick = function () {
		    stage.update();
        };
	res.text.text = "Loading...";
	res.visible = true;

	res.onLoad(function () {
	    res.text.text = "Press any key to play";
	    document.onkeyup = function (key) {
		status.money =  2000;
		status.healthy = 0;
		status.sick = 0;
		status.infected = 0;
		
		city.x = 0;
		city.y = 0;
		
		var scrollSpeed = 15;
    
		cursor = selector({
		    'colour': Graphics.getRGB(255,255,0),
		    'city': city,
		    'status': status,
		    'buildings': buildings.data.buildings,
		});
		
		update.tick = function (frameTime) {
		    status.frameTime = frameTime / 1000;
		    stage.update();
		    if(stage.mouseInBounds) {
			if(cursor){
			    cursor.moveTo(city.tileAt(stage.mouseX - city.x,
						      stage.mouseY - city.y));
			}
			
			if(stage.mouseX < 50) {
			    city.x += scrollSpeed;
			} else if(stage.mouseX > canvas.width - 20) {
			    city.x -= scrollSpeed;
			}
			if(stage.mouseY < 50) {
			    city.y += scrollSpeed;
			} else if(stage.mouseY > canvas.height - 20) {
			    city.y -= scrollSpeed;
			}

			if(city.x > -city.left()) city.x = -city.left();
			if(city.y > -city.top()) city.y = -city.top();
			if(city.x - canvas.width < -city.right()) city.x = -city.right() + canvas.width;
			if(city.y - canvas.height < -city.bottom()) city.y = -city.bottom() + canvas.height;
		    }
		};

		stage.onMouseDown = function (event) {
		    if(cursor) {
			cursor.place();
		    }
		}

		document.onkeyup = function (key) {
		    //cross browser issues exist
		    if (!key) { var key = window.event; }
		    switch (key.keyCode) {
		    case KEYCODE_1:
			if (cursor) {
			    cursor.setBuilding(0);
			}
			break;
		    case KEYCODE_2:
			if (cursor) {
			    cursor.setBuilding(1);
			}
			break;
		    case KEYCODE_3:
			if (cursor) {
			    cursor.setBuilding(2);
			}
			break;
		    case KEYCODE_4:
			if (cursor) {
			    cursor.setBuilding(3);
			}
			break;
		    case KEYCODE_5:
			if (cursor) {
			    cursor.setBuilding(4);
			}
			break;
		    case KEYCODE_6:
			if (cursor) { 
			    cursor.setBuilding(5);
			}
			break;
		    case KEYCODE_7:
			if (cursor) {
			    cursor.setBuilding(6);
			}
			break;
		    case KEYCODE_8:
			if (cursor) {
			    cursor.setBuilding(7);
			}
			break;
		    case KEYCODE_9:
			if (cursor) {
			    cursor.setBuilding(8);
			}
			break;
		    case KEYCODE_0:
			if (cursor) {
			    cursor.setBuilding(9);
			}
			break;
		    case KEYCODE_P:
			city.toggleOverlay();
		    }
		}

		stage.addChild(city);
		stage.addChild(cursor);
		stage.addChild(status);
		res.visible = false;
	    };
	});
    };

    var status = statusDisplay({'img': '/builder/img/icons.png'});
    res.load(status);

    var city = world({'socket': socket, 'status': status, 'reload': load});
    res.load(city);

    var buildings = jsonObject({'src': '/buildings.json'});
    res.load(buildings);

    var resize = function () {
	canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
	res.x = canvas.width / 2;
	res.y = canvas.height / 2;
    };

    var cursor;
    var update = {};

    load();
        
    window.addEventListener('resize', resize, false);
    resize();
    Ticker.addListener(update);
});