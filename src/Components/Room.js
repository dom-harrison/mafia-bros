import React from 'react';
import Chat from "./Chat";

const Room = ({ room = {}, messages = [], submitNewMessage, handleLeaveRoom }) =>{

    return (
      <div className="room section">
        <div>Room: {room.name}</div>
        <Chat messages={messages} submitNewMessage={submitNewMessage} handleLeaveRoom={handleLeaveRoom}/>
        <button className="room-button" onClick={handleLeaveRoom}>Leave room</button>
      </div>
    );
};

export default Room;