import React, { useState, useEffect } from 'react';
import UserTile from "./UserTile";


const Room = ({ userName = '', userRole='', userDead = false, room = {}, roomUsers = [], handleLeaveRoom, handleStartGame, handleAction }) => {

  const [actionCompleted, setActionCompleted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(undefined);

  useEffect(() => {
    setActionCompleted(false);
    setSelectedIndex(undefined);
  }, [room.nightTime])

  const handleUserClick = (target, index) => {
    console.log(target, index);
    if (!actionCompleted && !userDead && (userRole !== 'villager' || !room.nightTime)) {
      handleAction(target);
      setActionCompleted(true);
      setSelectedIndex(index);
    }
  }

  const gameReady = roomUsers && roomUsers.length > 2;
  const userTiles = (roomUsers || []).map((u, index) => <UserTile user={u} index={index} selected={selectedIndex === index} handleUserClick={handleUserClick}  key={u.name} />);
  const gamePostion = room.dayCount > 0 ? `${room.nightTime ? 'Night' : 'Day'} ${room.dayCount}` : 'Pregame';
  const voteTracker = room.nightTime || room.dayCount === 0 ? undefined : `Votes in: ${room.voteCount}/${room.aliveCount}`;

  return (
    <div className="room section">
      <div>Village: {room.name}</div>
      <div>{gamePostion}</div>
      <div>{`You: ${userName}`}</div>
      {voteTracker && <div>{voteTracker}</div>}
      <div className="users">{userTiles}</div>
      <div>{room.message}</div>
      {room.dayCount === 0 && <button className="primary-button" onClick={gameReady ? handleStartGame : undefined}>Start game</button>}
      <button className="primary-button" onClick={handleLeaveRoom}>Leave village</button>
    </div>
  );
};

export default Room;