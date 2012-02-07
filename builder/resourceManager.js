var resourceManager = function (spec, my) {
    var that;
    my = my || {};

    that = new Container();
    my.onLoad = [];
    my.resources = [];

    if(spec.img) {
        var img = new Image();
        img.onload = function () {
	    var bmp = new Bitmap(img);
	    that.addChildAt(bmp,0);
            bmp.x = -img.width/2;
            bmp.y = -img.height/2;
        }
        img.src = spec.img;
    }

    that.text = new Text("0", "32px sans-serif", "#ffffff");
    that.addChild(that.text);
    that.text.x = 105;
    that.text.y = 100;

    my.callback = function () {
        if (my.onLoad.length > 0 && that.loaded()) {
            while (my.onLoad.length > 0) {
                var f = my.onLoad.pop();
                f();
            }
        }
    }

    that.load = function (resource) {
        my.resources.push(resource);
        resource.load(my.callback);
    }

    that.loaded = function () {
        for (var i = 0; i < my.resources.length; i++) {
            if (!my.resources[i].loaded()) {
                return false;
            }
        }

        return true;
    }

    that.onLoad = function (callback) {
        if (that.loaded()) {
            callback();
        } else {
            my.onLoad.push(callback);
        }
    }

    return that;
}