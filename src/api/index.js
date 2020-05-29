import socketIOClient from "socket.io-client";

const clientHost = window.location.hostname;
let endpoint = `${clientHost}:4000`

if (clientHost.includes('client')){
  endpoint = clientHost.replace('client', 'server');
}

const socket = socketIOClient(`http://${endpoint}`, {transports: ['websocket', 'polling']});

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

export const onRoomStatus = (cb) => {
    socket.on("room_status", data => {
      // console.log(data);
      cb(data);
    });
}

export const onRoomUsers = (cb) => {
  socket.on("room_users", users => {
    // console.log(users);
    cb(users);
  });
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