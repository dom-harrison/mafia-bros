import React from 'react';

const UserTile = ({ user = {}, handleUserClick }) => { 
    return (
      <div className="user" onClick={() => handleUserClick(user.name)}>
        <div>{user.name}</div>
        <div>{user.role}</div>
      </div>
    );
  };
  
  export default UserTile;