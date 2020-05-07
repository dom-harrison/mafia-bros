var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};
const rooms = {}

io.on('connection', (socket) => {
    const { id } = socket.client;
    let room;
    let user;

    socket.on('login', ({ userName, roomName }) => {
      socket.join(roomName);
      user = userName
      users[id] = user;
      room = roomName;

      io.to(roomName).emit('new_message', `${userName} joined room ${roomName}`);

      if (rooms[room]) {
        rooms[room].users = [...rooms[roomName].users, userName];
      } else {
        rooms[room] = {
          name: room,
          users: [userName]
        }
      }

      io.to(roomName).emit('room_status', rooms[room]);
    });

    socket.on('leave_room', ({ userName, roomName }) => {
      socket.leave(roomName);
      io.to(roomName).emit('new_message', `${userName} left room ${roomName}`);
      if (rooms[roomName]) {
        rooms[roomName].users = rooms[roomName].users.filter(us => us !== userName);
      }
      
      io.to(roomName).emit('room_status', rooms[room]);
    });

    socket.on('new_message', (msg) => {
      socket.broadcast.to(room).emit('new_message', `${users[id]}: ${msg}`);
      console.log(`${id}: ${msg}`);
    });

    socket.on('disconnect', () => {
      if (rooms[room]) {
        rooms[room].users = rooms[room].users.filter(us => us !== user);
      }

      io.to(room).emit('room_status', rooms[room]);
      io.emit('new_message', `${users[id]} disconnected`);
      delete users[id];
    });
  });

http.listen(3001, () => {
  console.log('listening on *:3001');
});