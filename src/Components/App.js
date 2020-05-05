import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";
import Login from "./Login";

const endpoint = 'http://localhost:3001/'
const socket = socketIOClient(endpoint);

const App = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    socket.on('new message', data => {
      setMessages([...messages, data])
    });
  });

  const handleLogin = (e) =>{
    e.preventDefault()
    if(userName && roomName) {
      setFormComplete(true);
      socket.emit('login', { userName, roomName });
      console.log(socket.id);
    }
  }

  const submitNewMessage = (message) => {
    const msg = `${userName}: ${message}`
    socket.emit('new message', message);
    setMessages([...messages, msg]);
  }


  const loginProps = { userName, setUserName, roomName, setRoomName, handleLogin }
  return (
  <div id='app'>
    <Login { ...loginProps } />
    {formComplete && 
      <Chat userName={userName} messages={messages} submitNewMessage={submitNewMessage} />
    }
  </div>
  )
  
}

export default App;
