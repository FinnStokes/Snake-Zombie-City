var EVENT = (function () {
    var that, subscribers;
    
    that = {};
    subscribers = {};
    
    that.notify = function (event, data) {
        if (subscribers[event] != undefined) {
            for (var i = 0; i < subscribers[event].length; ++i) {
                subscribers[event][i](data);
            }
        }
    }
    
    that.subscribe = function (event, handler) {
        if (subscribers[event] == undefined) {
            subscribers[event] = [];
        }
        subscribers[event].push(handler);
    }
    
    that.unsubscribe = function (event, handler) {
        if (subscribers[event] != undefined) {
            var idx = subscribers[event].indexOf(handler);
            if (idx != -1) {
                subscribers[event].splice(idx, 1);
            }
        }
    }
    
    return that;
}());
