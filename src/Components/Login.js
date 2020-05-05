import React from 'react';

const Login= (props) => {
  const {userName, setUserName, roomName, setRoomName, handleLogin } = props;
    return (
      <form onSubmit={handleLogin}>
        What is your user name? <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        <br/>
        What is your room name? <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <br/>
        <button type='submit'>Join Room</button>
    </form>
    );
};

export default Login;