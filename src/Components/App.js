import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";
import Login from "./Login";

const endpoint = 'http://localhost:3001/'

const App = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    const socket = socketIOClient(endpoint);
    console.log('effect!');
    socket.on('new message', data => {
      setMessages([...messages, data])
    });
  });

  const handleLogin = (e) =>{
    e.preventDefault()
    if(userName && roomName) {
      const socket = socketIOClient(endpoint);
      setFormComplete(true);
      socket.emit('join', { userName, roomName });
      console.log(socket.id);
    }
  }

  const submitNewMessage = (message) => {
    const socket = socketIOClient(endpoint);
    socket.emit('new message', message);
    setMessages([...messages, `${userName}: ${message}`]);
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
