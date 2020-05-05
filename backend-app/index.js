var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    const { id } = socket.client;
    let room;

    socket.on('login', ({ userName, roomName }) => {
      socket.join(roomName);
      io.to(roomName).emit('new message', `${userName} joined room ${roomName}`);
      users[id] = userName;
      room = roomName;
    });

    socket.on('leave_room', ({ userName, roomName }) => {
      socket.leave(roomName);
      io.to(roomName).emit('new message', `${userName} left room ${roomName}`);
    });

    socket.on('new message', (msg) => {
      socket.broadcast.to(room).emit('new message', `${users[id]}: ${msg}`);
      console.log(`${id}: ${msg}`);
    });

    socket.on('disconnect', () => {
      io.emit('new message', `${users[id]} disconnected`);
      delete users[id];
    });
  });

http.listen(3001, () => {
  console.log('listening on *:3001');
});