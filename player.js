exports.create = function(spec,my) {
    var that, city;
    my = my || {};
    
    that = {};
    that.city = spec.city || null;
    
    return that;
}
