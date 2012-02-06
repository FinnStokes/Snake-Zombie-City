var jsonObject = function (spec, my) {
    var that;
    my = my || {};

    that = {}
    that.data = null;

    var src = spec.src;

    that.load = function (callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status==200 || window.location.href.indexOf("http")==-1){
                    that.data = eval("("+req.responseText+")");
                    callback();
                } else {
                    console.log(req);
                }
            }
        };
        req.open("GET", src, true);
        req.send(null);
    }

    that.loaded = function () {
        return that.data != null;
    }

    return that;
}