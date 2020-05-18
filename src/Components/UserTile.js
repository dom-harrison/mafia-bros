import React from 'react';

const UserTile = ({ user = {}, handleUserClick }) => { 
    return (
      <div onClick={() => handleUserClick(user.name)}>
        <div>{user.name}</div>
        <div>{user.role}</div>
      </div>
    );
  };
  
  export default UserTile;