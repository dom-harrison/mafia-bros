import React, { useState, useEffect } from 'react';
import UserTile from "./UserTile";


const Room = ({ userRole='', room = {}, roomUsers = [], handleLeaveRoom, handleStartGame, handleAction }) => {

  const [actionCompleted, setActionCompleted] = useState(false);

  useEffect(() => {
    setActionCompleted(false);
  }, [room.nightTime])

  const handleUserClick = (target) => {
    if (!actionCompleted && (!room.nightTime || userRole !== 'villager')) {
      handleAction(target);
      setActionCompleted(true);
    }
  }

  const gameReady = roomUsers && roomUsers.length > 2;
  const userTiles = (roomUsers || []).map(u => <UserTile user={u} key={u.name} handleUserClick={handleUserClick} />);
  const gamePostion = room.dayCount > 0 ? `${room.nightTime ? 'Night' : 'Day'} ${room.dayCount}` : 'Pregame'

  return (
    <div className="room section">
      <div>Village: {room.name}</div>
      <div>{gamePostion}</div>
      <div className="users">{userTiles}</div>
      <div>{room.message}</div>
      {room.dayCount === 0 && <button className="primary-button" onClick={gameReady ? handleStartGame : undefined}>Start game</button>}
      <button className="primary-button" onClick={handleLeaveRoom}>Leave village</button>
    </div>
  );
};

export default Room;