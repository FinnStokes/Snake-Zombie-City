var resourceManager = function (spec, my) {
    var that;
    my = my || {};

    that = new Container();
    my.onLoad = [];
    my.resources = [];

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