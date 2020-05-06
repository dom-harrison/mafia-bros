import React from 'react';

const Login = (props) => {
  const {userName, setUserName, roomName, setRoomName, handleLogin } = props;
    return (
      <form className="login" onSubmit={handleLogin}>
        <div className="field">User Name<br/><input value={userName} onChange={(e) => setUserName(e.target.value)} /></div>
        <div className="field">Room<br/><input value={roomName} onChange={(e) => setRoomName(e.target.value)} /></div>
        <button className="join-button" type='submit'>Join Room</button>
    </form>
    );
};

export default Login;