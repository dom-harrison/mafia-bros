import React from 'react';


const Room = ({ room = {}, handleLeaveRoom, handleStartGame }) =>{
  const { users, dayCount } = room;
  const gameReady = users && users.length > 2;

  return (
    <div className="room section">
      <div>Room: {room.name}</div>
      {dayCount === 0 && <button className="primary-button" onClick={gameReady && handleStartGame}>Start game</button>}
      <button className="primary-button" onClick={handleLeaveRoom}>Leave room</button>
    </div>
  );
};

export default Room;