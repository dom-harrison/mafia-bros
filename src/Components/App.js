import React, { useState, useEffect } from "react";
import JoinRoom from "./JoinRoom";
import Room from "./Room";
import SetName from "./SetName";
import Modal from "./Modal";
import useStateWithLocalStorage from "./useStateWithLocalStorage";
import { onNewMessage, onOpenRooms, onRejoinRoom, onRoomStatus, onRoomUsers, emit, onConnectionError, onReconnect, onDisconnect, socketOff, onLoginResponse } from "../api/index";

const App = () => {
  const [userName, setUserName] = useStateWithLocalStorage('userName');
  const [userId, setUserId] = useStateWithLocalStorage('userId');
  const [openRooms, setOpenRooms] = useState([]);
  const [rejoinRoom, setRejoinRoom] = useState(undefined);
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
      emit('leave_room', message);
      return 'unloading';
    };

    onNewMessage(data => {
      setMessages(m => [...m, data]);
    });
    onOpenRooms(rooms => {
      setOpenRooms(rooms);
    });
    onRejoinRoom(room => {
      setRejoinRoom(room);
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
            const userIx = users.findIndex(us => us.userName === updatedUser.userName);
            if (userIx === -1 && !updatedUser.remove && updatedUser.userName) {
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
    window.addEventListener("beforeunload", () => handleUnload('beforeunload')); // desktop
    window.addEventListener("pagehide", () => handleUnload('pagehide')); // mobile
    return () => {
      window.removeEventListener("beforeunload", () => handleUnload('beforeunload'));
      window.removeEventListener("pagehide", () => handleUnload('pagehide'));
    }
  }, []);

  useEffect(() => {
    const initialUserName = localStorage.getItem('userName');
    const initialUserId = localStorage.getItem('userId');
    if (initialUserName && initialUserId) {
      emit('login', { userName: initialUserName, userId: initialUserId });
    }
  }, [])
  
  useEffect(() => {
    onLoginResponse(res => {
      if (res.error) {
        setLoginError('User already exists');
        console.log('User exisits');
      } else {
        setUserName(res.userName);
        setUserId(res.userId);
      }
    })
  }, [setUserName, setUserId])

  useEffect(() => {
    onReconnect(() => {
      if (userName && roomName) {
        setModalMessage('Reconnecting');
        console.log('Rejoining room:', roomName);
        emit('login', { userName, userId, reconnect: true });
        emit('join_room', { userName, roomName: roomName, rejoining: true });
      } else if (userName) {
        emit('login', { userName, userId });
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
  }, [userName, userId, roomName])

  const handleJoinRoom = (choosenRoom, rejoining) => {
    setRoomName(choosenRoom);
    setRejoinRoom(undefined);
    setRoomUsers([]);
    emit('join_room', { userName, roomName: choosenRoom, rejoining });
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
    emit('action', { userName, target,  role });
  }

  const handleSetUserName = (inputName) => {
    emit('login', { userName: inputName, userId, newName: true });
  }

  return (
  <div id='app' className="app">
    {modalMessage && <Modal message={modalMessage} onConfirm={modalConfirm}/>}
    <div className="app-header">Mafia Bros</div>
    <div className="app-body">
    {!room &&
      <div>
      <SetName handleSetUserName={handleSetUserName} userName={userName} loginError={loginError} setLoginError={setLoginError}/>
      <JoinRoom openRooms={openRooms} rejoinRoom={rejoinRoom} handleJoinRoom={handleJoinRoom} connectError={connectError} userName={userName} />
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
