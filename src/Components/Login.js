import React, { useState } from 'react';

const Login = ({ handleLogin, connectError }) => {

  const [inputName, setInputName] = useState('');
  const [inputRoom, setInputRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputName && inputRoom) {
      handleLogin(inputName, inputRoom);
    }
  }

  return (
    <form className="login section" onSubmit={handleSubmit}>
      <div className="field">User Name<br/><input value={inputName} onChange={(e) => setInputName(e.target.value)} /></div>
      <div className="field">Village<br/><input value={inputRoom} onChange={(e) => setInputRoom(e.target.value)} /></div>
      <button className="primary-button" type='submit'>Enter Village</button>
      {connectError && <p className="connection-error">Connection error - please refresh and try again</p>}
    </form>
  );
};

export default Login;