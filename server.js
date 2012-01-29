var app = require('express').createServer();
var fs  = require('fs');

var io = require('socket.io').listen(app);

var builderIo = io.of('/builder');
var rescueIo = io.of('/rescue');

var city   = require('./city.js');
var player = require('./player.js');

var serveFile = function (req, res, path, mimetype) {
    fs.readFile(__dirname + path + req.params.file + '.' + req.params.ext,
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading ' + req.params.file+'.'+req.params.ext);
		            }
		            
		            var mimetype = '';
		            if (req.params.ext == 'html') mimetype = 'text/html';
		            if (req.params.ext == 'css') mimetype = 'text/css';
		            if (req.params.ext == 'js') mimetype = 'text/javascript';
		            if (req.params.ext == 'png') mimetype = 'image/png';
		            if (req.params.ext == 'json') mimetype = 'text/javascript';
		            res.writeHead(200, { 'Content-Type': mimetype });
		            res.end(data, 'utf-8');
	            });
};

app.get('/buildings.json', function (req, res){
    console.log(req.url);
    req.params.file = 'buildings';
    req.params.ext = 'json';
    serveFile(req, res, '/');
});

app.get('/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/lib/');
});

app.get('/builder/', function (req, res){
    console.log(req.url);
    req.params.file = 'index';
    req.params.ext = 'html';
    serveFile(req, res, '/builder/');
});

app.get('/builder/', function (req, res){
    console.log(req.url);
    req.params.file = 'index';
    req.params.ext = 'html';
    serveFile(req, res, '/builder/');
});

app.get('/builder/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/builder/');
});

app.get('/builder/img/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/builder/img/');
});

app.get('/builder/img/tileset/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/builder/img/tileset/');
});

app.get('/rescue/', function (req, res){
    console.log(req.url);
    req.params.file = 'index';
    req.params.ext = 'html';
    serveFile(req, res, '/rescue/');
});

app.get('/rescue/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/rescue/');
});

app.get('/rescue/img/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/rescue/img/');
});

app.get('/rescue/img/tileset/:file.:ext', function (req, res){
    console.log(req.url);
    serveFile(req, res, '/rescue/img/tileset/');
});

app.listen(80);

builderIo.on('connection', function (socket) {
    console.log('connect');
	var p = player.create({'socket': socket});
	
	socket.on('disconnect', function () {
		city.free('ruined',p.city);
		delete p;
	});
	
	socket.on('setcity', function (oldCity) {
		if (oldCity && city.add('infected', oldCity)) {
			city.remove('ruined', p.city);
			p.city = null;
		} else {
			console.log('Error setting city');
		}
	});

	socket.on('getcity', function () {
        console.log('get');
		if (p.city === null) {
			p.city = city.random('ruined', function (data) {
                socket.emit('city', data);
            });
		} else {
		    socket.emit('city', city.get('ruined',p.city));
        }
	});
});

rescueIo.on('connection', function (socket) {
	var p = player.create({'socket': socket});
	
	socket.on('disconnect', function () {
		city.free('infected',p.city);
		delete p;
	});
	
	socket.on('setcity', function (oldCity) {
		if (oldCity && city.add('ruined', oldCity)) {
			city.remove('infected', p.city);
			p.city = null;
		} else {
			console.log('Error setting city');
		}
	});

	socket.on('getcity', function () {
		if (p.city === null) {
			p.city = city.random('infected', function (data) {
                socket.emit('city', data);
            });
		} else {
		    socket.emit('city', city.get('infected',p.city));
        }
	});
});
