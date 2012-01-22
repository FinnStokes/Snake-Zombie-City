var tile = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Shape();
    
    that.graphics.setStrokeStyle(1);
    that.graphics.beginStroke(Graphics.getRGB(0,0,0));
    that.graphics.moveTo(-0.5,0);
    that.graphics.lineTo(0,-0.25);
    that.graphics.lineTo(0.5,0);
    that.graphics.lineTo(0,0.25);
    that.graphics.closePath();
    that.graphics.endStroke();

    that.x = spec.x || 0;
    that.y = spec.y || 0;
    
    return that;
};