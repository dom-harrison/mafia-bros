var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log("Socket id", socket.id);
    socket.on('join', function({userName, roomName}) {
      users[socket.client.id] = userName;
      console.log(userName + ' connected');
      socket.join(roomName);
      var room = io.sockets.adapter.rooms[roomName];
      console.log(room.length + ' users in ' + roomName);
      console.log(users);
    });
    socket.on('new message', (msg) => {
      const message = `${users[socket.client.id]}: ${msg}`;
      // socket.broadcast.emit('new message', message);
      io.emit('new message', message);
      console.log('msg: ' + message);
    });
    socket.on('disconnect', () => {
      delete users[socket.id];
    });
  });

http.listen(3001, () => {
  console.log('listening on *:3001');
});