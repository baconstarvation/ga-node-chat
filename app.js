/*    
Server
Need to send html, css, javascript
establish connnections with clients
listen to clients for new users
listen for messages from users
listen for disconnects

client
establish a connection with the server
listen for new messages from others
listen for updates about who is in the chatroom
listen for messages from the user to send to server
update the DOM appropriately

*/

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app); // socket.io is a module from npm
var fs = require('fs');
 
app.listen(8080);
 
function handler (req, res) {
	fs.readFile(__dirname + '/index.html', function(err, data) { //__dirname is name of current directory. in the directory that we're in, we want you to serve the file index.html
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
                }
 
                res.writeHead(200);
                res.end(data);
        });
}
 
var users = {};
 
io.sockets.on('connection', function(socket) { // establish a connection
        var username;
        socket.on('newUser', function(user) { // listen for new users
 
                username = user;
 
                users[username] = user;
 
                socket.broadcast.emit('newMessage', username, 'has joined the rooom');
 
                io.sockets.emit('updateUsers', users);
        });
 
        socket.on('message', function(message) { // listen for msgs from the client
                io.sockets.emit('newMessage', username, message);
        });
 
        socket.on('disconnect', function() { // listen for when a user leaves the cat room
                delete users[username];
 
                io.sockets.emit('updateUsers', users);
        });
 
});