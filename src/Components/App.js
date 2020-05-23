import React, { useState, useEffect } from "react";
import Room from "./Room";
import Login from "./Login";
import { onNewMessage, onRoomStatus, onRoomUsers, emit, onConnectionError } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});
  const [roomUsers, setRoomUsers] = useState([]);
  const [connectError, setConnectError] = useState(undefined);

  useEffect(() => {
    document.title = 'Mafia Bros'
    onNewMessage(data => {
      setMessages(m => [...m, data]);
    });
    onRoomStatus(data => {
      setRoom(data);
      setConnectError(false);
    });
    onRoomUsers(updatedUsers => {
      setRoomUsers(currentUsers => {
        if (currentUsers.length === 0) {
          return updatedUsers;
        } else {
          const users = [...currentUsers];
          updatedUsers.forEach(updatedUser => {
            const userIx = users.findIndex(us => us.name === updatedUser.name);
            if (userIx === -1) {
              users.push(updatedUser);
            } else if (updatedUser.remove) {
              users.splice(userIx, 1);
            } else {
              users[userIx] = { ...users[userIx], ...updatedUser}; 
            }
          })
          return users;
        }
        
      });
      setConnectError(false);
    });
    onConnectionError(res => {
      setConnectError(res);
      setRoom({});
      setRoomUsers([]);
    })
  }, []);

  const handleLogin = (name, roomName) => {
    setRoom({});
    setRoomUsers([]);
    emit('login', { name, roomName });
    setUserName(name);
    setFormComplete(true);
  }

  const handleLeaveRoom = () => {
    emit('leave_room');
    setFormComplete(false);
    setRoom({});
    setRoomUsers([]);
  }

  const handleStartGame = () => {
    emit('start_game');
  }

  const handleAction = (target, role) => {
    emit('action', { target,  role });
  }

  return (
  <div id='app' className="app">
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {(!formComplete || !!connectError)  &&
    <Login handleLogin={handleLogin} connectError={connectError} />}
    {formComplete && !connectError && 
      <Room 
        userName={userName}
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
