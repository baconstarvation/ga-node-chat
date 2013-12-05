var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
 
app.listen(8080);
 
function handler (req, res) {
        fs.readFile(__dirname + '/index.html', function(err, data) {
                if (err) {
                        res.writeHead(500);
                        return res.end('Error loading index.html');
                }
 
                res.writeHead(200);
                res.end(data);
        });
}
 
var users = {};
 
io.sockets.on('connection', function(socket) {
        var username;
        socket.on('newUser', function(user) {
 
                username = user;
 
                users[username] = user;
 
                socket.broadcast.emit('newMessage', username, 'has joined the rooom');
 
                io.sockets.emit('updateUsers', users);
        });
 
        socket.on('message', function(message) {
                io.sockets.emit('newMessage', username, message);
        });
 
        socket.on('disconnect', function() {
                delete users[username];
 
                io.sockets.emit('updateUsers', users);
        });
 
});