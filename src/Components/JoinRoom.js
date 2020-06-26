import React, { useState } from 'react';

const OpenRooms = ({ openRooms, handleLogin, connectError, userName }) => {

  const [inputRoom, setInputRoom] = useState('');
  const [choosenRoom, setChoosenRoom] = useState('');
  const [validationError, setValidationError] = useState('');

  const connectMessage = () => {
    switch (connectError) {
      case 'game-started':
        return 'Game already started';
      case 'room-unavailable':
        return 'Room not available'
      default:
        return 'Error - please refresh and try again;'
    }
  }
  

  const handleInput = (e) => {
    const input = e.target.value.substr(0, 12);
    setInputRoom(input.trim().toUpperCase());
  }

  const handleClick = (room) => {
    setChoosenRoom(room);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName) {
      setValidationError('Please confirm user name');
    } else if (choosenRoom) {
      handleLogin(choosenRoom);
      setValidationError('');
      setInputRoom('');
    }
  }

  const rooms = openRooms.map(room => (
    <div className="room-option" key={room}>
      <span className="room-span"><span className="room-name">{room}</span></span>
      <button className="button join-room" type='submit' onClick={() => handleClick(room)}>Enter</button>
      {validationError && room === choosenRoom && <div className="validation-error">{validationError}</div> }
    </div>
  ))

  return (
    <form className="join-room section" onSubmit={handleSubmit}>
      <div className="title">Join Village</div>
      {connectError && <p className="connection-error">{connectMessage()}</p>}
      <div className="rooms-grid">
        {rooms}
        <div className="room-option">
          <span className="room-span">
            <input value={inputRoom} placeholder="Enter village name" onChange={(e) => handleInput(e)} />
          </span>
          <button className="button join-room" type='submit' onClick={() => handleClick(inputRoom)}>Enter</button>
          {validationError && !!inputRoom && <div className="validation-error">{validationError}</div>}
        </div>
      </div>
    </form>
  );
};

export default OpenRooms;