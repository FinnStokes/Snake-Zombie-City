jQuery(document).ready(function () {
    var canvas = jQuery('#game').get(0);
    var stage = new Stage(canvas);
    var socket = io.connect('/rescue');

    canvas.width = 800;
    canvas.height = 600;
    
    var city = world({'socket': socket});
    city.load();
    stage.addChild(city);

    var update = {};
    update.tick = function () {
        stage.update();
    };
    Ticker.addListener(update);
});
