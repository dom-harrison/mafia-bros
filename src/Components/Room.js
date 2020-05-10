import React from 'react';
import UserTile from "./UserTile";


const Room = ({ room = {}, handleLeaveRoom, handleStartGame }) =>{
  const { users, dayCount } = room;
  const gameReady = users && users.length > 2;
  const userTiles = (users || []).map((u, index) => <UserTile user={u} key={index}></UserTile>);

  return (
    <div className="room section">
      <div>Room: {room.name}</div>
      <div>{userTiles}</div>
      {dayCount === 0 && <button className="primary-button" onClick={gameReady ? handleStartGame : undefined}>Start game</button>}
      <button className="primary-button" onClick={handleLeaveRoom}>Leave room</button>
    </div>
  );
};

export default Room;