var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    const { id } = socket.client;

    socket.on('login', ({ userName, roomName }) => {
      io.emit('new message', `${userName} joined ${roomName}`);
      console.log(`${userName} joined ${roomName}`);
      users[id] = userName;
      console.log(users);
    });

    socket.on('new message', (msg) => {
      socket.broadcast.emit('new message', `${users[id]}: ${msg}`);
      console.log(`${id}: ${msg}`);
    });
    socket.on('disconnect', () => {
      console.log('Disconnecting: ', id, users[id]);
      delete users[id];
      console.log(users);
    });
  });

http.listen(3001, () => {
  console.log('listening on *:3001');
});