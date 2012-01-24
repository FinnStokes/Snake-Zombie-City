var tile = function (spec, my) {
    var that;
    my = my || {};
    
    that = new BitmapAnimation(spec.tileset);
    that.gotoAndStop(spec.id);

    if (spec.offset) {
        that.regX = spec.offset.x;
        that.regY = spec.offset.y;
    }

    that.x = spec.x || 0;
    that.y = spec.y || 0;

    that.setTile = function (id, tileset, offset) {
        this.spriteSheet = tileset;
        this.gotoAndStop(id)
        this.regX = offset.x;
        this.regY = offset.y;
    };
    
    return that;
};