import socketIOClient from "socket.io-client";

console.log("Environment:" + process.env);

if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEBUG === 'true') {
  console.log('Debug on');
}

const clientHost = window.location.hostname;
let endpoint = `${clientHost}:4000`

if (clientHost.includes('client')){
  endpoint = clientHost.replace('client', 'server');
}

const socket = socketIOClient(endpoint/*, {transports: ['websocket', 'polling']}*/);

socket.on('error', error => {
  console.log(error)
})
socket.on('connect', res => {
  console.log('connect')
})
socket.on('connect_error', (error) => {
  console.log(error)
})

export const onNewMessage = (cb) => {
  // listen for any messages coming through
  // of type 'new_message' and then trigger the
  // callback function with said message
  socket.on("new_message", message => {
    // console.log the message for posterity
    // console.log(message);
    // trigger the callback passed in when
    // our App component calls connect
    cb(message);
  });
}

export const onOpenRooms = (cb) => {
  socket.on("open_rooms", rooms => {
    console.log('open rooms:', rooms);
    cb(rooms);
  });
}

export const onRejoinRoom = (cb) => {
  socket.on("rejoin_room", room => {
    console.log(room);
    cb(room);
  });
}

export const onRoomStatus = (cb) => {
    socket.on("room_status", data => {
      console.log('Status:', data);
      cb(data);
    });
}

export const onRoomUsers = (cb) => {
  socket.on("room_users", users => {
    console.log('Users:', users);
    cb(users);
  });
}

export const onReconnect = (cb) => {
  socket.on("reconnect", () => {
    console.log('reconnected');
    cb();
  });
}

export const onDisconnect = (cb) => {
  socket.on("disconnect", () => {
    console.log('disconnect');
    cb();
  });
}

export const socketOff = () => {
  socket.off("reconnect");
  socket.off("disconnect");
}

export const emit = (type, message) => {
    // emit a message of type 'type
    socket.emit(type, message);
}

export const onConnectionError = (cb) => {
  socket.on('error', error => {
    cb(error);
  })
  socket.on('connect_error', error => {
    cb(error);
  })
}

export const onLoginResponse = (cb) => {
  socket.on('login_response', res => {
    console.log('login_response', res);
    cb(res);
  })
}