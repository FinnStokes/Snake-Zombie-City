jQuery(document).ready(function () {
    var canvas = jQuery('#game').get(0);
    var stage = new Stage(canvas)
    var socket = io.connect('/builder');

    canvas.width = 800;
    canvas.height = 600;
    
    canvas.addEventListener
    
    var city = world({'socket': socket});
    city.load();
    stage.addChild(city);

    var scrollSpeed = 15;

    var cursor = selector({'colour': Graphics.getRGB(255,255,0,0.50)});
    stage.addChild(cursor);

    var update = {};
    update.tick = function () {
        stage.update();
        if(stage.mouseInBounds) {
            cursor.moveTo(city.tileAt(stage.mouseX - stage.x,
                                      stage.mouseY - stage.y));
            
            if(stage.mouseX < 50) {
                stage.x += scrollSpeed;
            } else if(stage.mouseX > canvas.width - 20) {
                stage.x -= scrollSpeed;
            }
            if(stage.mouseY < 50) {
                stage.y += scrollSpeed;
            } else if(stage.mouseY > canvas.height - 20) {
                stage.y -= scrollSpeed;
            }
        } else {
            cursor.hide();
        }
    };
    Ticker.addListener(update);
});
