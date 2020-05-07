import React from 'react';
import Chat from "./Chat";

const Room = ({ roomStatus = {}, messages = [], submitNewMessage, handleLeaveRoom }) =>{

    return (
      <div className="room section">
        <div>Room: {roomStatus.name}</div>
        <div>Users: {(roomStatus.users || []).map(user => `${user}, `)}</div>
        <Chat messages={messages} submitNewMessage={submitNewMessage} handleLeaveRoom={handleLeaveRoom}/>
      </div>
    );
};

export default Room;