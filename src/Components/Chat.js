import React, { useState } from 'react';

const Chat = ({ messages = [], submitNewMessage, handleLeaveRoom }) =>{

    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault()
      submitNewMessage(newMessage);
      setNewMessage('');
    }

    const handleChange = (e) => {
      setNewMessage(e.target.value);
    }

    const conversation = messages.map((message, index) => (
      <li key={index} className="message">{message}</li>
    ))

    return (
      <div className="chat">
        <ul className="conversation">{conversation}</ul>
        <form className="message-input" onSubmit={handleSubmit}>
          <input value={newMessage} onChange={handleChange} /><button className="send button" type='submit'>Send</button>
        </form>
        <button className="room-button" onClick={handleLeaveRoom}>Leave room</button>
      </div>
    );
};

export default Chat;