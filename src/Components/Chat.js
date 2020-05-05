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

    const conversation = messages.map(message => (
      <li>{message}</li>
    ))

    return (
      <div>
      <ul>{conversation}</ul>
        <form onSubmit={handleSubmit}>
          <input value={newMessage} onChange={handleChange} /><button type='submit'>Send</button>
        </form>
        <button onClick={handleLeaveRoom}>Leave room</button>
      </div>
    );
};

export default Chat;