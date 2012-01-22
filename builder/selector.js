var selector = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Shape();
    that.visible = false;

 	that.graphics.beginFill(spec.colour);
 	that.graphics.moveTo(-0.5,0);
 	that.graphics.lineTo(0,-0.5);
 	that.graphics.lineTo(0.5,0);
 	that.graphics.lineTo(0,0.5);
 	that.graphics.closePath();
 	that.graphics.endFill();

    that.moveTo = function (pos) {
        if(pos) {
            that.x = (pos.x - pos.y) * pos.width / 2;
            that.y = (pos.x + pos.y) * pos.height / 2;
            that.scaleX = pos.width;
            that.scaleY = pos.height;
            that.visible = true;
        }
    }

    that.hide = function () {
        that.visible = false;
    }
    
    return that;
};