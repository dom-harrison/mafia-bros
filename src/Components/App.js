import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Room from "./Room";
import Login from "./Login";

const endpoint = 'http://localhost:3001/'
const socket = socketIOClient(endpoint);

const App = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});


  useEffect(() => {
    document.title = 'Mafia Bros'
    socket.on('new_message', data => {
      setMessages(m => [...m, data]);
    });
    socket.on('room_status', data => {
      setRoom(data);
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    if(userName && roomName) {
      setFormComplete(true);
      socket.emit('login', { userName, roomName });
      console.log(socket.id);
    }
  }

  const handleLeaveRoom = (e) => {
    e.preventDefault()
    socket.emit('leave_room');
    setFormComplete(false);
    setMessages([]);
  }

  const handleStartGame = () => {
    socket.emit('start_game');
  }

  return (
  <div id='app' className="app">
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!formComplete &&
    <Login userName={userName} setUserName={setUserName} roomName={roomName} setRoomName={setRoomName} handleLogin={handleLogin} />}
    {formComplete && 
      <Room room={room} userName={userName} handleLeaveRoom={handleLeaveRoom} handleStartGame={handleStartGame} />}
    </div>
  </div>
  )
}

export default App;
