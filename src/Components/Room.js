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

  return (
    <div className="room section">
      <div>Room: {room.name}</div>
      <div>{userTiles}</div>
      {room.dayCount === 0 && <button className="primary-button" onClick={gameReady ? handleStartGame : undefined}>Start game</button>}
      <button className="primary-button" onClick={handleLeaveRoom}>Leave room</button>
    </div>
  );
};

export default Room;