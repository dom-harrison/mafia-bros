import React, { useState } from 'react';

const Login = ({ handleLogin, connectError }) => {

  const [inputName, setInputName] = useState('');
  const [inputRoom, setInputRoom] = useState('');

  const handleInput = (e, field) => {
    const input = e.target.value.substr(0, 12);
    if (field === 'name') {
      setInputName(input);
    } else {
      setInputRoom(input.trim().toUpperCase());
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputName && inputRoom) {
      handleLogin(inputName, inputRoom);
    }
  }

  return (
    <form className="login section" onSubmit={handleSubmit}>
      <div className="title">Start Village</div>
      <div className="field">User Name<br/><input value={inputName} onChange={(e) => handleInput(e, 'name') } /></div>
      <div className="field">Village Name<br/><input value={inputRoom} onChange={(e) => handleInput (e, 'village')} /></div>
      <button className="button primary" type='submit'>Enter Village</button>
      {connectError && <p className="connection-error">{connectError === 'Game started' ? 'Game already started': 'Error - please refresh and try again'}</p>}
    </form>
  );
};

export default Login;