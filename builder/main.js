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
    
    canvas.width = 800;
    canvas.height = 600;

    var status = {
        "money": 2000,
        "population": 0,
        "sick": 0,
        "infected": 0,
    };

    var city = world({'socket': socket, 'status': status});
    city.load();
    stage.addChild(city);
    
    var scrollSpeed = 15;
    
    var cursor;
    var buildings = jQuery.getJSON('/buildings.json', function (data) {
        cursor = selector({
            'colour': Graphics.getRGB(255,255,0),
            'city': city,
            'buildings': data.buildings,
            'status': status,
        });
        city.addChild(cursor);
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
    
    var resize = function () {
	    canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
                       
    stage.addChild(statusDisplay({'status': status}));     

    window.addEventListener('resize', resize, false);
    Ticker.addListener(update);
    resize();
});
