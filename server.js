var static = require('node-static');
var http = require('http');

var file = new(static.Server)();
var app = http.createServer(function (req, res) {
	file.serve(req, res);
}).listen(3000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
	socket.on('push', function(msg){
		socket.broadcast.emit('pull', msg);
	});
});