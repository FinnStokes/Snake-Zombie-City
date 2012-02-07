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

jQuery(document).ready(function () {
    var canvas = jQuery('#game').get(0);
    var stage = new Stage(canvas);
    var socket = io.connect('/builder');
    var res = resourceManager();
    
    canvas.width = 800;
    canvas.height = 600;

    stage.addChild(res);

    var reload = function () {
	stage.removeAllChildren();
	stage.addChild(res);
        stage.onMouseDown = null;

	res.onLoad(function () {
	    status.money =  2000;
            status.population = 5;
            status.sick = 0;
            status.infected = 0;

	    city.x = 0;
	    city.y = 0;

            stage.onMouseDown = function (event) {
		if(cursor) {
                    cursor.place();
		}
            }

            stage.addChild(city);
            stage.addChild(cursor);
            stage.addChild(status); 
	});
    };

    var status = statusDisplay({'img': '/builder/img/icons.png'});
    res.load(status);

    var city = world({'socket': socket, 'status': status, 'reload': reload});
    res.load(city);

    var buildings = jsonObject({'src': '/buildings.json'});
    res.load(buildings);

    var resize = function () {
	canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    var cursor;
        
    window.addEventListener('resize', resize, false);

    res.onLoad(function () {
        status.money =  2000;
        status.population = 5;
        status.sick = 0;
        status.infected = 0;
        
        var scrollSpeed = 15;
    
        cursor = selector({
            'colour': Graphics.getRGB(255,255,0),
            'city': city,
            'status': status,
            'buildings': buildings.data.buildings,
        });
    
        var update = {};
        update.tick = function () {
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
            }
        }
        
        stage.addChild(city);
        stage.addChild(cursor);
        stage.addChild(status);     

        Ticker.addListener(update);
        resize();
    });
});