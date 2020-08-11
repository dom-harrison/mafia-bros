import React, { useState, useEffect } from "react";
import JoinRoom from "./JoinRoom";
import Room from "./Room";
import SetName from "./SetName";
import Modal from "./Modal";
import { onNewMessage, onOpenRooms, onReconnectRoom, onRoomStatus, onRoomUsers, emit, onConnectionError, onReconnect, onDisconnect, socketOff } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [openRooms, setOpenRooms] = useState([]);
  const [reconnectRoom, setReconnectRoom] = useState(undefined);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(undefined);
  const [roomUsers, setRoomUsers] = useState([]);
  const [connectError, setConnectError] = useState(undefined);
  const [loginError, setLoginError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirm, setModalConfirm] = useState(undefined);

  useEffect(() => {
    document.title = 'Mafia Bros'

    const handleUnload = (message) => {
      emit('logout', message);
      return 'unloading';
    };

    onNewMessage(data => {
      setMessages(m => [...m, data]);
    });
    onOpenRooms(rooms => {
      setOpenRooms(rooms);
    });
    onReconnectRoom(room => {
      setReconnectRoom(room);
    });
    onRoomStatus(data => {
      setRoom(data);
      setModalMessage('');
      setConnectError(false);
    });
    onRoomUsers((updatedUsers = []) => {
      setRoomUsers(currentUsers => {
        if (currentUsers.length === 0) {
          return updatedUsers;
        } else {
          const users = [...currentUsers];
          updatedUsers.forEach(updatedUser => {
            const userIx = users.findIndex(us => us.name === updatedUser.name);
            if (userIx === -1 && !updatedUser.remove && updatedUser.name) {
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
      if (res === 'room-unavailable') {
        setModalMessage('');
        console.log('Room unavailable leave room');
        handleLeaveRoom();
      } else if (res === 'user-exists') {
        setLoginError('User already exists');
        console.log('User exisits');
      }
    })
    window.addEventListener("beforeunload", () => handleUnload('beforeunload')); // desktop
    window.addEventListener("pagehide", () => handleUnload('pagehide')); // mobile
    return () => {
      window.removeEventListener("beforeunload", () => handleUnload('beforeunload'));
      window.removeEventListener("pagehide", () => handleUnload('pagehide'));
    }
  }, []);

  useEffect(() => {
    onReconnect(() => {
      if (userName) {
        emit('login', { name: userName, reconnecting: true });
      }
      if (roomName) {
        setModalMessage('Reconnecting');
        console.log('Reconnecting to room:', roomName);
        emit('join_room', { name: userName, roomName: roomName, reconnecting: true });
      }
    })
    onDisconnect(() => {
      if (userName && roomName) {
        setModalMessage('Reconnecting');
      }
    })
    return () => {
      socketOff();
    }
  }, [userName, roomName])

  const handleJoinRoom = (choosenRoom, reconnecting) => {
    setRoomName(choosenRoom);
    setReconnectRoom(undefined);
    setRoomUsers([]);
    emit('join_room', {name: userName, roomName: choosenRoom, reconnecting});
  }

  const handleLeaveRoom = () => {
    console.log('Leave room');
    setRoom(undefined);
    setRoomUsers([]);
    setRoomName('');
    emit('leave_room');
  }

  const handleStartGame = () => {
    emit('start_game');
  }

  const handleAction = (target, role) => {
    emit('action', { target,  role });
  }

  const handleSetUserName = (name) => {
    setUserName(name);
    if (name) {
      emit('login', { name });
    }
  }

  return (
  <div id='app' className="app">
    {modalMessage && <Modal message={modalMessage} onConfirm={modalConfirm}/>}
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!room &&
      <div>
      <SetName handleSetUserName={handleSetUserName} userName={userName} loginError={loginError} setLoginError={setLoginError}/>
      <JoinRoom openRooms={openRooms} reconnectRoom={reconnectRoom} handleJoinRoom={handleJoinRoom} connectError={connectError} userName={userName} />
      </div>
    }
    {!!room && 
      <Room 
        userName={userName}
        room={room} 
        roomUsers={roomUsers} 
        messages={messages} 
        handleLeaveRoom={handleLeaveRoom} 
        handleStartGame={handleStartGame} 
        handleAction={handleAction}
        setModalMessage={setModalMessage}
        setModalConfirm={setModalConfirm}
      />}
    </div>
  </div>
  )
}

export default App;
