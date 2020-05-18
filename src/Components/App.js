import React, { useState, useEffect } from "react";
import Room from "./Room";
import Login from "./Login";
import { onNewMessage, onRoomStatus, onRoomUsers, emit } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    document.title = 'Mafia Bros'
    onNewMessage(data => {
      setMessages(m => [...m, data]);
    });
    onRoomStatus(data => {
      setRoom(data);
    });
  }, []);

  useEffect(() => {
    console.log('user update');
    onRoomUsers(users => {
      setRoomUsers(currentUsers => {
        if (currentUsers.length === 0) {
          return users;
        } else {
          const updatedUsers = [...currentUsers];
          users.forEach(user => {
            const userIx = updatedUsers.findIndex(updatedUser => updatedUser.name === user.name);
            if (userIx === -1) {
              updatedUsers.push(user);
            } else {
              updatedUsers[userIx] = { ...updatedUsers[userIx], ...user}; 
            }
            if (user.name === userName.name) { setUserRole(user.role); }
          })
          return updatedUsers;
        }
        
      });
    });
  }, [userName]);

  const handleLogin = (name, roomName) => {
    setUserName({ name });
    setFormComplete(true);
    emit('login', { name, roomName });
  }

  const handleLeaveRoom = (e) => {
    e.preventDefault()
    emit('leave_room');
    setFormComplete(false);
    setMessages([]);
    setRoom({});
    setRoomUsers([]);
  }

  const handleStartGame = () => {
    emit('start_game');
  }

  const handleAction = (target) => {
    emit('action', target);
  }

  return (
  <div id='app' className="app">
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!formComplete &&
    <Login handleLogin={handleLogin} />}
    {formComplete && 
      <Room 
        userRole={userRole} 
        room={room} 
        roomUsers={roomUsers} 
        messages={messages} 
        handleLeaveRoom={handleLeaveRoom} 
        handleStartGame={handleStartGame} 
        handleAction={handleAction}
      />}
    </div>
  </div>
  )
}

export default App;
