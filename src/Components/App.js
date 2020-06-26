import React, { useState, useEffect } from "react";
import JoinRoom from "./JoinRoom";
import Room from "./Room";
import SetName from "./SetName";
import Modal from "./Modal";
import { onNewMessage, onOpenRooms, onRoomStatus, onRoomUsers, emit, onConnectionError, onReconnect, onDisconnect, socketOff } from "../api/index";

const App = () => {
  const [userName, setUserName] = useState('');
  const [openRooms, setOpenRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(undefined);
  const [roomUsers, setRoomUsers] = useState([]);
  const [connectError, setConnectError] = useState(undefined);
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirm, setModalConfirm] = useState(undefined);

  useEffect(() => {
    document.title = 'Mafia Bros'
    onNewMessage(data => {
      setMessages(m => [...m, data]);
    });
    onOpenRooms(rooms => {
      setOpenRooms(rooms);
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
      }
    })
    window.addEventListener("beforeunload", (e) => {
      console.log('Unload leave room');
      handleLeaveRoom();
    });
    return () => {
      window.removeEventListener("beforeunload", (e) => {
        handleLeaveRoom();
      });
    }
  }, []);

  useEffect(() => {
    onReconnect(() => {
      if (userName && roomName) {
        setModalMessage('Reconnecting');
        console.log('Reconnecting to room:', roomName);
        emit('login', { name: userName, roomName: roomName, reconnecting: true });
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

  const handleLogin = (choosenRoom) => {
    setRoomName(choosenRoom);
    setRoomUsers([]);
    emit('login', {name: userName, roomName: choosenRoom});
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

  return (
  <div id='app' className="app">
    {modalMessage && <Modal message={modalMessage} onConfirm={modalConfirm}/>}
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!room &&
      <div>
      <SetName setUserName={setUserName} userName={userName}/>
      <JoinRoom openRooms={openRooms} handleLogin={handleLogin} connectError={connectError} userName={userName} />
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
