import React, { useState, useEffect } from "react";
import Room from "./Room";
import Login from "./Login";
import { onNewMessage, onRoomStatus, onRoomUsers, emit } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userDead, setUserDead] = useState(false);
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
    onRoomUsers(updatedUsers => {
      setRoomUsers(currentUsers => {
        if (currentUsers.length === 0) {
          return updatedUsers;
        } else {
          const users = [...currentUsers];
          updatedUsers.forEach(user => {
            const userIx = users.findIndex(updatedUser => updatedUser.name === user.name);
            if (userIx === -1) {
              users.push(user);
            } else {
              users[userIx] = { ...users[userIx], ...user}; 
            }
            if (user.name === userName) { 
              setUserRole(r => r || user.role || '');
              setUserDead(d => d || user.dead || false);
            }
          })
          return users;
        }
        
      });
    });
  }, [userName]);

  const handleLogin = (name, roomName) => {
    emit('login', { name, roomName });
    setUserName(name);
    setFormComplete(true);
  }

  const handleLeaveRoom = () => {
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
    emit('action', { target,  role: userRole });
  }

  return (
  <div id='app' className="app">
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!formComplete &&
    <Login handleLogin={handleLogin} />}
    {formComplete && 
      <Room 
        userName={userName}
        userRole={userRole}
        userDead={userDead}
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
