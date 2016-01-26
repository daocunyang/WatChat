var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var colors = ["blue", "red", "hotpink", "aqua", "crimson", "orange", "green", "yellowgreen"];

var port = Number(process.env.PORT || 3000);
server.listen(port);

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function(socket){

    io.emit('usernums', users);

	socket.on('new user', function(data, callback){
		if (users.indexOf(data) !== -1 ) {
			callback(false);
		}
		else {
			callback(true);
			socket.user = data;
			var colorIdx = Math.floor(Math.random()*colors.length);
			socket.Color = colors[colorIdx];
			users.push(data);
			io.emit('usernums', users);
			io.emit('notify guys', {Name: socket.user, condition: "join"});
		}
	});

	socket.on('send message', function(data){
		io.emit("new message", {msg: data, Name: socket.user, Color: socket.Color});
	});

	socket.on('disconnect', function(data){
		if (!socket.user) 
			return;
		users.splice(users.indexOf(socket.user), 1);
		io.emit('usernums', users);
		socket.broadcast.emit('notify guys', {Name: socket.user, condition: "leave"});
	});
});




console.log("Listening on port 3000...");