import socketIOClient from "socket.io-client";

const hostName = window.location.hostname;
const endpoint = `${hostName}:4000`;
// const endpoint = 'mb-server:4000'
const socket = socketIOClient(endpoint);

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
    console.log(message);
    // trigger the callback passed in when
    // our App component calls connect
    cb(message);
  });
}

export const onRoomStatus = (cb) => {
    socket.on("room_status", message => {
      console.log(message);
      cb(message);
    });
}

export const onRoomUsers = (cb) => {
  socket.on("room_users", users => {
    console.log('roomusers called: ', users);
    cb(users);
  });
}

export const emit = (type, message) => {
    // emit a message of type 'type
    socket.emit(type, message);
}
