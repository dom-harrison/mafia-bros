import React, { useState } from 'react';

const Login = ({ setUserName, userName = '' }) => {

  const [inputName, setInputName] = useState(userName);
  const [confirmed, setConfirmed] = useState(!!userName);


  const handleInput = (e, field) => {
    const input = e.target.value.substr(0, 12);
    if (field === 'name') {
      setInputName(input);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (confirmed) {
      setConfirmed(false)
      setUserName('');
    } else if (inputName) {
      setUserName(inputName);
      setConfirmed(true);
    }
  }

  return (
    <form className="set-name section" onSubmit={handleSubmit}>
      <div className="title">User name</div>
      {confirmed ?
        <div className="input-body">
          <span className="name-span">{userName}</span>
          <button className="button edit-name" type='submit'>Edit</button>
        </div>
        :
        <div className="input-body">
          <span className="input-span"><input value={inputName} placeholder="Enter user name" onChange={(e) => handleInput(e, 'name') } /></span>
          <button className="button confirm-name" type='submit'>Confirm</button>
        </div>
      }
    </form>
  );
};

export default Login;