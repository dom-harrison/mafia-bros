import React, { useState, useEffect } from "react";
import Room from "./Room";
import Login from "./Login";
import { newMessage, roomStatus, emit } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});

  useEffect(() => {
    document.title = 'Mafia Bros'
    newMessage(data => {
      setMessages(m => [...m, data]);
    });
    roomStatus(data => {
      setRoom(data);
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    if(userName && roomName) {
      setFormComplete(true);
      emit('login', { userName, roomName });
    }
  }

  const handleLeaveRoom = (e) => {
    e.preventDefault()
    emit('leave_room');
    setFormComplete(false);
    setMessages([]);
  }

  const handleStartGame = () => {
    emit('start_game');
  }

  return (
  <div id='app' className="app">
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!formComplete &&
    <Login userName={userName} setUserName={setUserName} roomName={roomName} setRoomName={setRoomName} handleLogin={handleLogin} />}
    {formComplete && 
      <Room room={room} messages={messages} userName={userName} handleLeaveRoom={handleLeaveRoom} handleStartGame={handleStartGame} />}
    </div>
  </div>
  )
}

export default App;
